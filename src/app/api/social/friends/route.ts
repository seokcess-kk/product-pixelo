import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { FriendsListResponse, FriendWithProfile } from '@/types'

/**
 * GET /api/social/friends
 * 친구 목록 조회 (팔로잉/팔로워)
 */
export async function GET(request: NextRequest) {
  try {
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

    // 내가 팔로우하는 사람들 (following)
    const { data: followingData, error: followingError } = await supabase
      .from('friendships')
      .select(
        `
        id,
        created_at,
        following:users!friendships_following_id_fkey (
          id,
          nickname,
          avatar_url,
          bio,
          is_public
        )
      `
      )
      .eq('follower_id', user.id)
      .eq('status', 'active')

    if (followingError) {
      console.error('Error fetching following:', followingError)
      return NextResponse.json(
        {
          error: {
            code: 'INTERNAL_ERROR',
            message: '팔로잉 목록을 불러오는 중 오류가 발생했습니다.',
          },
        },
        { status: 500 }
      )
    }

    // 나를 팔로우하는 사람들 (followers)
    const { data: followersData, error: followersError } = await supabase
      .from('friendships')
      .select(
        `
        id,
        created_at,
        follower:users!friendships_follower_id_fkey (
          id,
          nickname,
          avatar_url,
          bio,
          is_public
        )
      `
      )
      .eq('following_id', user.id)
      .eq('status', 'active')

    if (followersError) {
      console.error('Error fetching followers:', followersError)
      return NextResponse.json(
        {
          error: {
            code: 'INTERNAL_ERROR',
            message: '팔로워 목록을 불러오는 중 오류가 발생했습니다.',
          },
        },
        { status: 500 }
      )
    }

    // 상호 팔로우 관계 확인을 위한 Set
    const followingIds = new Set(
      followingData?.map((f) => (f.following as { id: string })?.id) || []
    )
    const followerIds = new Set(
      followersData?.map((f) => (f.follower as { id: string })?.id) || []
    )

    // Following 목록 변환
    const following: FriendWithProfile[] = (followingData || [])
      .filter((f) => f.following)
      .map((f) => {
        const followingUser = f.following as {
          id: string
          nickname: string
          avatar_url: string | null
          bio: string | null
          is_public: boolean
        }
        return {
          id: followingUser.id,
          nickname: followingUser.nickname,
          avatarUrl: followingUser.avatar_url ?? undefined,
          bio: followingUser.bio ?? undefined,
          isPublic: followingUser.is_public,
          isMutual: followerIds.has(followingUser.id),
          followedAt: f.created_at,
        }
      })

    // Followers 목록 변환
    const followers: FriendWithProfile[] = (followersData || [])
      .filter((f) => f.follower)
      .map((f) => {
        const followerUser = f.follower as {
          id: string
          nickname: string
          avatar_url: string | null
          bio: string | null
          is_public: boolean
        }
        return {
          id: followerUser.id,
          nickname: followerUser.nickname,
          avatarUrl: followerUser.avatar_url ?? undefined,
          bio: followerUser.bio ?? undefined,
          isPublic: followerUser.is_public,
          isMutual: followingIds.has(followerUser.id),
          followedAt: f.created_at,
        }
      })

    // 상호 팔로우 수 계산
    const mutualCount = following.filter((f) => f.isMutual).length

    const response: FriendsListResponse = {
      following,
      followers,
      mutualCount,
    }

    return NextResponse.json({ data: response })
  } catch (error) {
    console.error('Unexpected error in GET /api/social/friends:', error)
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
