import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import {
  createdResponse,
  handleError,
  UnauthorizedError,
  NotFoundError,
  ValidationError,
  ConflictError,
} from '@/lib/api'
import type {
  AnswerResponse,
  AcquiredObject,
  QuestionRow,
  QuestionChoiceRow,
  AxisDefinitionRow,
  AxisScoreRow,
  SeasonRow,
  UserSeasonRow,
  ObjectRow,
  UserObjectRow,
} from '@/types/questions'

/**
 * 응답 요청 스키마
 */
const answerSchema = z.object({
  questionId: z.string().uuid('유효한 질문 ID가 필요합니다.'),
  choiceId: z.string().uuid('유효한 선택지 ID가 필요합니다.'),
})

/**
 * POST /api/questions/answer
 * 응답 저장
 * - 사용자 응답 저장
 * - 축 점수 재계산
 * - 오브젝트 획득 처리
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. 현재 사용자 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new UnauthorizedError()
    }

    // 2. 요청 바디 파싱 및 유효성 검증
    let body: unknown
    try {
      body = await request.json()
    } catch {
      throw new ValidationError('유효한 JSON 형식이 필요합니다.')
    }

    const parseResult = answerSchema.safeParse(body)
    if (!parseResult.success) {
      throw new ValidationError(
        '입력 데이터가 유효하지 않습니다.',
        parseResult.error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }))
      )
    }

    const { questionId, choiceId } = parseResult.data

    // 3. 질문 존재 여부 확인
    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('*, seasons(*)')
      .eq('id', questionId)
      .single<QuestionRow & { seasons: SeasonRow }>()

    if (questionError || !question) {
      throw new NotFoundError('질문')
    }

    // 4. 시즌이 활성 상태인지 확인
    if (!question.seasons.is_active) {
      throw new ValidationError('현재 활성화되지 않은 시즌의 질문입니다.')
    }

    // 5. 선택지 존재 여부 및 해당 질문의 선택지인지 확인
    const { data: choice, error: choiceError } = await supabase
      .from('question_choices')
      .select('*, axis_definitions(*)')
      .eq('id', choiceId)
      .eq('question_id', questionId)
      .single<QuestionChoiceRow & { axis_definitions: AxisDefinitionRow }>()

    if (choiceError || !choice) {
      throw new NotFoundError('선택지')
    }

    // 6. 이미 답변했는지 확인
    const { data: existingAnswer, error: existingError } = await supabase
      .from('answers')
      .select('id')
      .eq('user_id', user.id)
      .eq('question_id', questionId)
      .single()

    if (existingAnswer) {
      throw new ConflictError('이미 답변한 질문입니다.')
    }

    // 7. 답변 저장
    const { data: newAnswer, error: answerError } = await supabase
      .from('answers')
      .insert({
        user_id: user.id,
        question_id: questionId,
        choice_id: choiceId,
      })
      .select()
      .single()

    if (answerError || !newAnswer) {
      throw new Error('답변 저장에 실패했습니다.')
    }

    // 8. 축 점수 업데이트 또는 생성
    const axisId = choice.axis_id
    const scoreValue = choice.score_value
    const seasonId = question.season_id

    let { data: axisScore, error: axisScoreError } = await supabase
      .from('axis_scores')
      .select('*')
      .eq('user_id', user.id)
      .eq('season_id', seasonId)
      .eq('axis_id', axisId)
      .single<AxisScoreRow>()

    if (axisScoreError && axisScoreError.code === 'PGRST116') {
      // 축 점수가 없으면 새로 생성
      const { data: newAxisScore, error: insertError } = await supabase
        .from('axis_scores')
        .insert({
          user_id: user.id,
          season_id: seasonId,
          axis_id: axisId,
          total_score: scoreValue,
          answer_count: 1,
        })
        .select()
        .single<AxisScoreRow>()

      if (insertError) {
        console.error('축 점수 생성 실패:', insertError)
        throw new Error('축 점수 생성에 실패했습니다.')
      }
      axisScore = newAxisScore
    } else if (axisScoreError) {
      console.error('축 점수 조회 실패:', axisScoreError)
      throw new Error('축 점수 조회에 실패했습니다.')
    } else if (axisScore) {
      // 기존 축 점수 업데이트
      const { data: updatedAxisScore, error: updateError } = await supabase
        .from('axis_scores')
        .update({
          total_score: axisScore.total_score + scoreValue,
          answer_count: axisScore.answer_count + 1,
        })
        .eq('id', axisScore.id)
        .select()
        .single<AxisScoreRow>()

      if (updateError) {
        console.error('축 점수 업데이트 실패:', updateError)
        throw new Error('축 점수 업데이트에 실패했습니다.')
      }
      axisScore = updatedAxisScore
    }

    // 9. 사용자 시즌 진행 상태 업데이트
    const { data: userSeason, error: userSeasonError } = await supabase
      .from('user_seasons')
      .select('*')
      .eq('user_id', user.id)
      .eq('season_id', seasonId)
      .single<UserSeasonRow>()

    if (userSeason) {
      const newCurrentDay = userSeason.current_day + 1
      const isCompleted = newCurrentDay >= question.seasons.total_days

      await supabase
        .from('user_seasons')
        .update({
          current_day: newCurrentDay,
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
        })
        .eq('id', userSeason.id)
    }

    // 10. 오브젝트 획득 처리
    const acquiredObjects: AcquiredObject[] = []

    // 10a. 일차 기반 오브젝트 확인
    const dayNumber = question.day_number
    const { data: dayObjects, error: dayObjectsError } = await supabase
      .from('objects')
      .select('*')
      .eq('season_id', seasonId)
      .eq('acquisition_type', 'day')
      .eq('acquisition_day', dayNumber)

    if (dayObjects && dayObjects.length > 0) {
      for (const obj of dayObjects as ObjectRow[]) {
        // 이미 획득했는지 확인
        const { data: existingUserObject } = await supabase
          .from('user_objects')
          .select('id')
          .eq('user_id', user.id)
          .eq('object_id', obj.id)
          .single()

        if (!existingUserObject) {
          const { error: insertObjError } = await supabase
            .from('user_objects')
            .insert({
              user_id: user.id,
              object_id: obj.id,
              acquired_reason: `day_${dayNumber}`,
            })

          if (!insertObjError) {
            acquiredObjects.push({
              id: obj.id,
              name: obj.name,
              imageUrl: obj.image_url,
              thumbnailUrl: obj.thumbnail_url,
              reason: `Day ${dayNumber} 완료`,
            })
          }
        }
      }
    }

    // 10b. 축 점수 기반 오브젝트 확인
    if (axisScore) {
      const currentAverage = axisScore.average_score
      if (currentAverage !== null) {
        // 현재 축의 점수 범위에 해당하는 오브젝트 조회
        const { data: axisObjects, error: axisObjectsError } = await supabase
          .from('objects')
          .select('*')
          .eq('season_id', seasonId)
          .eq('acquisition_type', 'axis_score')
          .eq('axis_id', axisId)

        if (axisObjects && axisObjects.length > 0) {
          for (const obj of axisObjects as ObjectRow[]) {
            // 점수 범위 확인
            const roundedAverage = Math.round(currentAverage)
            const minScore = obj.min_score || 1
            const maxScore = obj.max_score || 5

            if (roundedAverage >= minScore && roundedAverage <= maxScore) {
              // 이미 획득했는지 확인
              const { data: existingUserObject } = await supabase
                .from('user_objects')
                .select('id')
                .eq('user_id', user.id)
                .eq('object_id', obj.id)
                .single()

              if (!existingUserObject) {
                const { error: insertObjError } = await supabase
                  .from('user_objects')
                  .insert({
                    user_id: user.id,
                    object_id: obj.id,
                    acquired_reason: `axis_${choice.axis_definitions.axis_code}_${roundedAverage}`,
                  })

                if (!insertObjError) {
                  acquiredObjects.push({
                    id: obj.id,
                    name: obj.name,
                    imageUrl: obj.image_url,
                    thumbnailUrl: obj.thumbnail_url,
                    reason: `${choice.axis_definitions.name} 점수 달성`,
                  })
                }
              }
            }
          }
        }
      }
    }

    // 11. 응답 반환
    const response: AnswerResponse = {
      answerId: newAnswer.id,
      questionId: questionId,
      choiceId: choiceId,
      answeredAt: newAnswer.answered_at,
      axisScore: {
        axisCode: choice.axis_definitions.axis_code,
        axisName: choice.axis_definitions.name,
        scoreValue: scoreValue,
        newAverage: axisScore?.average_score || scoreValue,
      },
      acquiredObjects,
    }

    return createdResponse(response)
  } catch (error) {
    return handleError(error)
  }
}
