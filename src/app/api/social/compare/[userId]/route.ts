import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import type { AxisScore, ComparisonData } from '@/types'

const paramsSchema = z.object({
  userId: z.string().uuid('유효한 사용자 ID가 아닙니다.'),
})

const querySchema = z.object({
  seasonId: z.string().uuid('유효한 시즌 ID가 아닙니다.').optional(),
})

interface RouteParams {
  params: Promise<{ userId: string }>
}

/**
 * GET /api/social/compare/[userId]
 * 친구 비교 데이터 조회 (7개 축 점수 비교)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const parseResult = paramsSchema.safeParse(resolvedParams)

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: parseResult.error.errors[0].message,
          },
        },
        { status: 400 }
      )
    }

    const { userId: friendUserId } = parseResult.data

    // Query parameters
    const { searchParams } = new URL(request.url)
    const queryResult = querySchema.safeParse({
      seasonId: searchParams.get('seasonId') || undefined,
    })

    const seasonId = queryResult.success ? queryResult.data.seasonId : undefined

    const supabase = await createClient()

    // 현재 로그인한 사용자 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: '로그인이 필요합니다.',
          },
        },
        { status: 401 }
      )
    }

    // 자기 자신과 비교 불가
    if (user.id === friendUserId) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_REQUEST',
            message: '자기 자신과는 비교할 수 없습니다.',
          },
        },
        { status: 400 }
      )
    }

    // 친구 사용자 확인
    const { data: friendUser, error: userError } = await supabase
      .from('users')
      .select('id, nickname, avatar_url, is_public')
      .eq('id', friendUserId)
      .is('deleted_at', null)
      .single()

    if (userError || !friendUser) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: '사용자를 찾을 수 없습니다.',
          },
        },
        { status: 404 }
      )
    }

    // 접근 권한 확인: 공개 프로필이거나 팔로우 관계
    if (!friendUser.is_public) {
      const { data: friendship } = await supabase
        .from('friendships')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', friendUserId)
        .eq('status', 'active')
        .single()

      if (!friendship) {
        return NextResponse.json(
          {
            error: {
              code: 'FORBIDDEN',
              message: '이 사용자의 점수를 볼 권한이 없습니다.',
            },
          },
          { status: 403 }
        )
      }
    }

    // 시즌 ID가 없으면 현재 활성 시즌 사용
    let targetSeasonId = seasonId
    if (!targetSeasonId) {
      const { data: activeSeason } = await supabase
        .from('seasons')
        .select('id')
        .eq('is_active', true)
        .single()

      if (activeSeason) {
        targetSeasonId = activeSeason.id
      }
    }

    if (!targetSeasonId) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: '활성 시즌을 찾을 수 없습니다.',
          },
        },
        { status: 404 }
      )
    }

    // 축 정의 조회
    const { data: axisDefinitions, error: axisError } = await supabase
      .from('axis_definitions')
      .select('id, axis_code, name, low_end_name, high_end_name, axis_order')
      .eq('season_id', targetSeasonId)
      .order('axis_order', { ascending: true })

    if (axisError || !axisDefinitions || axisDefinitions.length === 0) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: '축 정의를 찾을 수 없습니다.',
          },
        },
        { status: 404 }
      )
    }

    // 내 점수 조회
    const { data: myScoresData } = await supabase
      .from('axis_scores')
      .select('axis_id, average_score, final_score')
      .eq('user_id', user.id)
      .eq('season_id', targetSeasonId)

    // 친구 점수 조회
    const { data: friendScoresData } = await supabase
      .from('axis_scores')
      .select('axis_id, average_score, final_score')
      .eq('user_id', friendUserId)
      .eq('season_id', targetSeasonId)

    // 점수 맵 생성
    const myScoresMap = new Map(
      (myScoresData || []).map((s) => [
        s.axis_id,
        { averageScore: s.average_score, finalScore: s.final_score },
      ])
    )
    const friendScoresMap = new Map(
      (friendScoresData || []).map((s) => [
        s.axis_id,
        { averageScore: s.average_score, finalScore: s.final_score },
      ])
    )

    // AxisScore 배열 생성
    const myScores: AxisScore[] = axisDefinitions.map((axis) => {
      const score = myScoresMap.get(axis.id)
      return {
        axisId: axis.id,
        axisCode: axis.axis_code,
        axisName: axis.name,
        lowEndName: axis.low_end_name,
        highEndName: axis.high_end_name,
        averageScore: score?.averageScore ?? undefined,
        finalScore: score?.finalScore ?? undefined,
      }
    })

    const friendScores: AxisScore[] = axisDefinitions.map((axis) => {
      const score = friendScoresMap.get(axis.id)
      return {
        axisId: axis.id,
        axisCode: axis.axis_code,
        axisName: axis.name,
        lowEndName: axis.low_end_name,
        highEndName: axis.high_end_name,
        averageScore: score?.averageScore ?? undefined,
        finalScore: score?.finalScore ?? undefined,
      }
    })

    // 유사도 계산
    const similarities: ComparisonData['similarities'] = []
    let totalDifference = 0
    let validComparisons = 0

    for (const axis of axisDefinitions) {
      const myScore = myScoresMap.get(axis.id)
      const friendScore = friendScoresMap.get(axis.id)

      // 둘 다 점수가 있는 경우에만 비교
      const myValue = myScore?.finalScore ?? myScore?.averageScore
      const friendValue = friendScore?.finalScore ?? friendScore?.averageScore

      if (myValue !== null && myValue !== undefined && friendValue !== null && friendValue !== undefined) {
        const difference = Math.abs(myValue - friendValue)
        totalDifference += difference
        validComparisons++

        similarities.push({
          axisCode: axis.axis_code,
          axisName: axis.name,
          scoreDifference: Number(difference.toFixed(2)),
          isSimilar: difference <= 1,
        })
      } else {
        similarities.push({
          axisCode: axis.axis_code,
          axisName: axis.name,
          scoreDifference: -1, // 비교 불가
          isSimilar: false,
        })
      }
    }

    // 전체 유사도 계산 (0-100%)
    // 최대 차이는 축당 4점 (1~5 범위), 7개 축이면 최대 28점
    let overallSimilarity = 0
    if (validComparisons > 0) {
      const maxPossibleDifference = validComparisons * 4 // 각 축 최대 차이 4점
      overallSimilarity = Math.round(
        ((maxPossibleDifference - totalDifference) / maxPossibleDifference) * 100
      )
    }

    const response: ComparisonData = {
      myScores,
      friendScores,
      similarities,
      overallSimilarity,
      friendInfo: {
        id: friendUser.id,
        nickname: friendUser.nickname,
        avatarUrl: friendUser.avatar_url ?? undefined,
      },
    }

    return NextResponse.json({ data: response })
  } catch (error) {
    console.error('Unexpected error in GET /api/social/compare/[userId]:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: '서버 오류가 발생했습니다.',
        },
      },
      { status: 500 }
    )
  }
}
