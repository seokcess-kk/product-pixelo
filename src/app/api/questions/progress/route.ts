import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  successResponse,
  handleError,
  UnauthorizedError,
  NotFoundError,
} from '@/lib/api'
import type {
  ProgressResponse,
  AxisScoreSummary,
  SeasonRow,
  UserSeasonRow,
  AxisScoreRow,
  AxisDefinitionRow,
} from '@/types/questions'

/**
 * GET /api/questions/progress
 * 시즌별 진행률 조회
 * - 시즌별 답변 완료 수
 * - 전체 진행률 (%)
 * - 축별 점수 현황
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. 현재 사용자 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new UnauthorizedError()
    }

    // 2. 쿼리 파라미터에서 시즌 ID 확인 (없으면 활성 시즌 사용)
    const { searchParams } = new URL(request.url)
    const seasonIdParam = searchParams.get('seasonId')

    let season: SeasonRow | null = null

    if (seasonIdParam) {
      // 특정 시즌 조회
      const { data: requestedSeason, error: seasonError } = await supabase
        .from('seasons')
        .select('*')
        .eq('id', seasonIdParam)
        .single<SeasonRow>()

      if (seasonError || !requestedSeason) {
        throw new NotFoundError('시즌')
      }
      season = requestedSeason
    } else {
      // 활성 시즌 조회
      const { data: activeSeason, error: activeSeasonError } = await supabase
        .from('seasons')
        .select('*')
        .eq('is_active', true)
        .single<SeasonRow>()

      if (activeSeasonError || !activeSeason) {
        throw new NotFoundError('활성 시즌')
      }
      season = activeSeason
    }

    // 3. 사용자의 시즌 참여 정보 조회
    const { data: userSeason, error: userSeasonError } = await supabase
      .from('user_seasons')
      .select('*')
      .eq('user_id', user.id)
      .eq('season_id', season.id)
      .single<UserSeasonRow>()

    // 참여 정보가 없으면 초기 상태 반환
    if (userSeasonError && userSeasonError.code === 'PGRST116') {
      const response: ProgressResponse = {
        seasonId: season.id,
        seasonName: season.name,
        currentDay: 0,
        totalDays: season.total_days,
        isCompleted: false,
        answeredCount: 0,
        progressPercentage: 0,
        axisScores: [],
      }
      return successResponse(response)
    }

    if (userSeasonError) {
      throw new Error('시즌 참여 정보 조회에 실패했습니다.')
    }

    // 4. 해당 시즌의 축 정의 조회
    const { data: axisDefinitions, error: axisDefError } = await supabase
      .from('axis_definitions')
      .select('*')
      .eq('season_id', season.id)
      .order('axis_order', { ascending: true })

    if (axisDefError) {
      throw new Error('축 정의 조회에 실패했습니다.')
    }

    // 5. 사용자의 축 점수 조회
    const { data: axisScores, error: axisScoresError } = await supabase
      .from('axis_scores')
      .select('*')
      .eq('user_id', user.id)
      .eq('season_id', season.id)

    if (axisScoresError) {
      throw new Error('축 점수 조회에 실패했습니다.')
    }

    // 6. 축 점수 맵 생성
    const axisScoreMap = new Map<string, AxisScoreRow>()
    ;(axisScores as AxisScoreRow[])?.forEach((score) => {
      axisScoreMap.set(score.axis_id, score)
    })

    // 7. 축 점수 요약 구성
    const axisScoreSummaries: AxisScoreSummary[] = (axisDefinitions as AxisDefinitionRow[])?.map((axis) => {
      const score = axisScoreMap.get(axis.id)
      return {
        axisCode: axis.axis_code,
        axisName: axis.name,
        lowEndName: axis.low_end_name,
        highEndName: axis.high_end_name,
        answerCount: score?.answer_count || 0,
        averageScore: score?.average_score || null,
        finalScore: score?.final_score || null,
      }
    }) || []

    // 8. 진행률 계산
    const currentDay = userSeason?.current_day || 0
    const totalDays = season.total_days
    const progressPercentage = totalDays > 0 ? Math.round((currentDay / totalDays) * 100) : 0

    // 9. 응답 반환
    const response: ProgressResponse = {
      seasonId: season.id,
      seasonName: season.name,
      currentDay: currentDay,
      totalDays: totalDays,
      isCompleted: userSeason?.is_completed || false,
      answeredCount: currentDay,
      progressPercentage: progressPercentage,
      axisScores: axisScoreSummaries,
    }

    return successResponse(response)
  } catch (error) {
    return handleError(error)
  }
}
