import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  successResponse,
  handleError,
  UnauthorizedError,
  NotFoundError
} from '@/lib/api'
import type {
  TodayQuestionsResponse,
  TodayQuestion,
  QuestionRow,
  QuestionChoiceRow,
  SeasonRow,
  UserSeasonRow,
  AnswerRow,
} from '@/types/questions'

/**
 * GET /api/questions/today
 * 오늘의 질문 조회
 * - 사용자가 아직 답하지 않은 질문 최대 5개 반환
 * - 현재 활성 시즌의 질문만 필터링
 */
export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. 현재 사용자 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log('[questions/today] 1. Auth check:', { userId: user?.id, authError })
    if (authError || !user) {
      throw new UnauthorizedError()
    }

    // 2. 현재 활성 시즌 조회
    const { data: activeSeason, error: seasonError } = await supabase
      .from('seasons')
      .select('*')
      .eq('is_active', true)
      .single<SeasonRow>()
    console.log('[questions/today] 2. Season check:', { activeSeason, seasonError })

    if (seasonError || !activeSeason) {
      throw new NotFoundError('활성 시즌')
    }

    // 3. 사용자의 시즌 참여 정보 조회 또는 생성
    let { data: userSeason, error: userSeasonError } = await supabase
      .from('user_seasons')
      .select('*')
      .eq('user_id', user.id)
      .eq('season_id', activeSeason.id)
      .single<UserSeasonRow>()

    console.log('[questions/today] 3. UserSeason check:', { userSeason, userSeasonError })
    if (userSeasonError && userSeasonError.code === 'PGRST116') {
      // 참여 정보가 없으면 새로 생성
      console.log('[questions/today] 3a. Creating new user_season...')
      const { data: newUserSeason, error: insertError } = await supabase
        .from('user_seasons')
        .insert({
          user_id: user.id,
          season_id: activeSeason.id,
          current_day: 0,
        })
        .select()
        .single<UserSeasonRow>()

      console.log('[questions/today] 3b. Insert result:', { newUserSeason, insertError })
      if (insertError) {
        throw new Error(`시즌 참여 정보 생성에 실패했습니다: ${insertError.message}`)
      }
      userSeason = newUserSeason
    } else if (userSeasonError) {
      throw new Error(`시즌 참여 정보 조회에 실패했습니다: ${userSeasonError.message}`)
    }

    // 시즌이 이미 완료된 경우
    if (userSeason?.is_completed) {
      const response: TodayQuestionsResponse = {
        seasonId: activeSeason.id,
        seasonName: activeSeason.name,
        questions: [],
        progress: {
          currentDay: userSeason.current_day,
          totalDays: activeSeason.total_days,
        },
      }
      return successResponse(response)
    }

    // 4. 사용자가 이미 답한 질문 ID 목록 조회
    const { data: answeredQuestions, error: answeredError } = await supabase
      .from('answers')
      .select(`
        question_id,
        questions!inner(season_id)
      `)
      .eq('user_id', user.id)

    if (answeredError) {
      throw new Error('응답 기록 조회에 실패했습니다.')
    }

    const answeredQuestionIds = new Set(
      answeredQuestions
        ?.filter((a: { question_id: string; questions: { season_id: string } | null }) =>
          a.questions?.season_id === activeSeason.id
        )
        .map((a: { question_id: string }) => a.question_id) || []
    )

    // 5. 아직 답하지 않은 질문 조회 (day_number 순서대로, 최대 5개)
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('season_id', activeSeason.id)
      .order('day_number', { ascending: true })

    if (questionsError) {
      throw new Error('질문 조회에 실패했습니다.')
    }

    // 답하지 않은 질문만 필터링
    const unansweredQuestions = (questions as QuestionRow[])?.filter(
      (q) => !answeredQuestionIds.has(q.id)
    ).slice(0, 5) || []

    if (unansweredQuestions.length === 0) {
      const response: TodayQuestionsResponse = {
        seasonId: activeSeason.id,
        seasonName: activeSeason.name,
        questions: [],
        progress: {
          currentDay: userSeason?.current_day || 0,
          totalDays: activeSeason.total_days,
        },
      }
      return successResponse(response)
    }

    // 6. 질문별 선택지 조회
    const questionIds = unansweredQuestions.map((q) => q.id)
    const { data: choices, error: choicesError } = await supabase
      .from('question_choices')
      .select('*')
      .in('question_id', questionIds)
      .order('choice_order', { ascending: true })

    if (choicesError) {
      throw new Error('선택지 조회에 실패했습니다.')
    }

    // 7. 응답 데이터 구성
    const choicesByQuestion = new Map<string, QuestionChoiceRow[]>()
    ;(choices as QuestionChoiceRow[])?.forEach((choice) => {
      const existing = choicesByQuestion.get(choice.question_id) || []
      existing.push(choice)
      choicesByQuestion.set(choice.question_id, existing)
    })

    const todayQuestions: TodayQuestion[] = unansweredQuestions.map((q) => ({
      id: q.id,
      dayNumber: q.day_number,
      questionText: q.question_text,
      questionType: q.question_type,
      choices: (choicesByQuestion.get(q.id) || []).map((c) => ({
        id: c.id,
        order: c.choice_order,
        text: c.choice_text,
      })),
    }))

    const response: TodayQuestionsResponse = {
      seasonId: activeSeason.id,
      seasonName: activeSeason.name,
      questions: todayQuestions,
      progress: {
        currentDay: userSeason?.current_day || 0,
        totalDays: activeSeason.total_days,
      },
    }

    return successResponse(response)
  } catch (error) {
    console.error('[questions/today] ERROR:', error)
    return handleError(error)
  }
}
