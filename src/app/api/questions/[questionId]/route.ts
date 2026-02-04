import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import {
  successResponse,
  handleError,
  UnauthorizedError,
  NotFoundError,
  ValidationError,
} from '@/lib/api'
import type {
  QuestionDetailResponse,
  QuestionChoiceDetail,
  UserAnswerInfo,
  QuestionRow,
  QuestionChoiceRow,
  AxisDefinitionRow,
  AnswerRow,
} from '@/types/questions'

/**
 * 경로 파라미터 스키마
 */
const paramsSchema = z.object({
  questionId: z.string().uuid('유효한 질문 ID가 필요합니다.'),
})

/**
 * GET /api/questions/[questionId]
 * 특정 질문 상세 조회
 * - 질문 정보 및 선택지
 * - 각 선택지의 축 정보
 * - 사용자의 응답 정보 (있는 경우)
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const supabase = await createClient()

    // 1. 현재 사용자 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new UnauthorizedError()
    }

    // 2. 경로 파라미터 유효성 검증
    const resolvedParams = await params
    const parseResult = paramsSchema.safeParse(resolvedParams)
    if (!parseResult.success) {
      throw new ValidationError(
        '유효한 질문 ID가 필요합니다.',
        parseResult.error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }))
      )
    }

    const { questionId } = parseResult.data

    // 3. 질문 조회
    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('*')
      .eq('id', questionId)
      .single<QuestionRow>()

    if (questionError || !question) {
      throw new NotFoundError('질문')
    }

    // 4. 선택지 및 축 정보 조회
    const { data: choices, error: choicesError } = await supabase
      .from('question_choices')
      .select(`
        *,
        axis_definitions(*)
      `)
      .eq('question_id', questionId)
      .order('choice_order', { ascending: true })

    if (choicesError) {
      throw new Error('선택지 조회에 실패했습니다.')
    }

    // 5. 사용자 응답 조회
    const { data: userAnswer, error: answerError } = await supabase
      .from('answers')
      .select('*')
      .eq('user_id', user.id)
      .eq('question_id', questionId)
      .single<AnswerRow>()

    // PGRST116은 결과가 없는 경우이므로 에러로 처리하지 않음
    let userAnswerInfo: UserAnswerInfo | null = null
    if (userAnswer && !answerError) {
      userAnswerInfo = {
        answerId: userAnswer.id,
        choiceId: userAnswer.choice_id,
        answeredAt: userAnswer.answered_at,
      }
    }

    // 6. 선택지 상세 정보 구성
    const choiceDetails: QuestionChoiceDetail[] = (
      choices as (QuestionChoiceRow & { axis_definitions: AxisDefinitionRow })[]
    )?.map((choice) => {
      // 점수 방향 판단 (1-2: low, 3: middle, 4-5: high)
      let scoreDirection: 'low' | 'high' | 'middle' = 'middle'
      if (choice.score_value <= 2) {
        scoreDirection = 'low'
      } else if (choice.score_value >= 4) {
        scoreDirection = 'high'
      }

      return {
        id: choice.id,
        order: choice.choice_order,
        text: choice.choice_text,
        axisInfo: {
          axisCode: choice.axis_definitions.axis_code,
          axisName: choice.axis_definitions.name,
          scoreDirection,
        },
      }
    }) || []

    // 7. 응답 반환
    const response: QuestionDetailResponse = {
      id: question.id,
      seasonId: question.season_id,
      dayNumber: question.day_number,
      questionText: question.question_text,
      questionType: question.question_type,
      choices: choiceDetails,
      userAnswer: userAnswerInfo,
    }

    return successResponse(response)
  } catch (error) {
    return handleError(error)
  }
}
