import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import type { FriendSpace, ObjectPlacement, SpaceObjectInfo } from '@/types'

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
 * GET /api/social/visit/[userId]
 * 친구 공간 조회 (읽기 전용)
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

    const { userId: targetUserId } = parseResult.data

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

    // 자기 자신 공간은 다른 API 사용
    if (user.id === targetUserId) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_REQUEST',
            message: '자신의 공간은 /api/space를 사용하세요.',
          },
        },
        { status: 400 }
      )
    }

    // 대상 사용자 확인
    const { data: targetUser, error: userError } = await supabase
      .from('users')
      .select('id, nickname, avatar_url, is_public')
      .eq('id', targetUserId)
      .is('deleted_at', null)
      .single()

    if (userError || !targetUser) {
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

    // 접근 권한 확인: 공개 프로필이거나 팔로우 관계인 경우만 허용
    if (!targetUser.is_public) {
      const { data: friendship } = await supabase
        .from('friendships')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .eq('status', 'active')
        .single()

      if (!friendship) {
        return NextResponse.json(
          {
            error: {
              code: 'FORBIDDEN',
              message: '이 사용자의 공간을 볼 권한이 없습니다.',
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

    // 공간 정보 조회
    const { data: space, error: spaceError } = await supabase
      .from('spaces')
      .select(
        `
        id,
        user_id,
        season_id,
        name,
        is_public,
        layout,
        background_variant,
        last_edited_at,
        seasons (
          name,
          space_type,
          space_background_url
        )
      `
      )
      .eq('user_id', targetUserId)
      .eq('season_id', targetSeasonId)
      .single()

    if (spaceError || !space) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: '공간을 찾을 수 없습니다.',
          },
        },
        { status: 404 }
      )
    }

    // 공간이 비공개인 경우 추가 확인
    if (!space.is_public) {
      const { data: friendship } = await supabase
        .from('friendships')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .eq('status', 'active')
        .single()

      if (!friendship) {
        return NextResponse.json(
          {
            error: {
              code: 'FORBIDDEN',
              message: '이 공간은 비공개입니다.',
            },
          },
          { status: 403 }
        )
      }
    }

    // layout에서 objectId 추출
    const layout = (space.layout as ObjectPlacement[]) || []
    const objectIds = layout.map((item) => item.objectId)

    // 오브젝트 정보 조회
    let objects: SpaceObjectInfo[] = []
    if (objectIds.length > 0) {
      const { data: objectsData } = await supabase
        .from('objects')
        .select(
          `
          id,
          name,
          image_url,
          thumbnail_url,
          width,
          height,
          object_categories (
            code,
            layer_order
          )
        `
        )
        .in('id', objectIds)

      if (objectsData) {
        objects = objectsData.map((obj) => {
          const category = obj.object_categories as {
            code: string
            layer_order: number
          } | null
          return {
            id: obj.id,
            name: obj.name,
            imageUrl: obj.image_url,
            thumbnailUrl: obj.thumbnail_url ?? undefined,
            categoryCode: category?.code ?? '',
            layerOrder: category?.layer_order ?? 0,
            width: obj.width ?? undefined,
            height: obj.height ?? undefined,
          }
        })
      }
    }

    // 방문 기록 저장
    await supabase.from('space_visits').insert({
      visitor_id: user.id,
      space_id: space.id,
    })

    // 응답 데이터 구성
    const season = space.seasons as {
      name: string
      space_type: string
      space_background_url: string | null
    }

    const response: FriendSpace = {
      id: space.id,
      userId: space.user_id,
      seasonId: space.season_id,
      name: space.name ?? undefined,
      isPublic: space.is_public,
      layout,
      backgroundVariant: space.background_variant ?? undefined,
      lastEditedAt: space.last_edited_at ?? undefined,
      user: {
        nickname: targetUser.nickname,
        avatarUrl: targetUser.avatar_url ?? undefined,
      },
      season: {
        name: season.name,
        spaceType: season.space_type,
        spaceBackgroundUrl: season.space_background_url ?? undefined,
      },
      objects,
    }

    return NextResponse.json({ data: response })
  } catch (error) {
    console.error('Unexpected error in GET /api/social/visit/[userId]:', error)
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
