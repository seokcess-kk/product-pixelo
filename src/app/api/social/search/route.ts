import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import type { UserSearchResult, PaginatedResponse } from '@/types'

const querySchema = z.object({
  q: z.string().min(1, '검색어를 입력해주세요.').max(50, '검색어는 50자 이하여야 합니다.'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
})

/**
 * GET /api/social/search
 * 사용자 검색 (닉네임 기준)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const parseResult = querySchema.safeParse({
      q: searchParams.get('q') || '',
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 20,
    })

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

    const { q: query, page, limit } = parseResult.data
    const offset = (page - 1) * limit

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

    // 사용자 검색 (닉네임 기준, 공개 프로필만)
    const { data: users, error: searchError, count } = await supabase
      .from('users')
      .select('id, nickname, avatar_url, bio, is_public', { count: 'exact' })
      .eq('is_public', true)
      .is('deleted_at', null)
      .neq('id', user.id) // 자기 자신 제외
      .ilike('nickname', `%${query}%`)
      .order('nickname', { ascending: true })
      .range(offset, offset + limit - 1)

    if (searchError) {
      console.error('Error searching users:', searchError)
      return NextResponse.json(
        {
          error: {
            code: 'INTERNAL_ERROR',
            message: '사용자 검색 중 오류가 발생했습니다.',
          },
        },
        { status: 500 }
      )
    }

    if (!users || users.length === 0) {
      const emptyResponse: PaginatedResponse<UserSearchResult> = {
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      }
      return NextResponse.json(emptyResponse)
    }

    // 검색된 사용자들의 ID 목록
    const userIds = users.map((u) => u.id)

    // 내가 팔로우하는 사용자 확인
    const { data: followingData } = await supabase
      .from('friendships')
      .select('following_id')
      .eq('follower_id', user.id)
      .eq('status', 'active')
      .in('following_id', userIds)

    const followingIds = new Set(followingData?.map((f) => f.following_id) || [])

    // 나를 팔로우하는 사용자 확인
    const { data: followersData } = await supabase
      .from('friendships')
      .select('follower_id')
      .eq('following_id', user.id)
      .eq('status', 'active')
      .in('follower_id', userIds)

    const followerIds = new Set(followersData?.map((f) => f.follower_id) || [])

    // 응답 데이터 변환
    const results: UserSearchResult[] = users.map((u) => ({
      id: u.id,
      nickname: u.nickname,
      avatarUrl: u.avatar_url ?? undefined,
      bio: u.bio ?? undefined,
      isFollowing: followingIds.has(u.id),
      isFollower: followerIds.has(u.id),
    }))

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    const response: PaginatedResponse<UserSearchResult> = {
      data: results,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Unexpected error in GET /api/social/search:', error)
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
