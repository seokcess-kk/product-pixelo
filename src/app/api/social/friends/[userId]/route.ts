import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const paramsSchema = z.object({
  userId: z.string().uuid('유효한 사용자 ID가 아닙니다.'),
})

interface RouteParams {
  params: Promise<{ userId: string }>
}

/**
 * POST /api/social/friends/[userId]
 * 친구 추가 (팔로우)
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
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

    // 자기 자신 팔로우 방지
    if (user.id === targetUserId) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_REQUEST',
            message: '자기 자신을 팔로우할 수 없습니다.',
          },
        },
        { status: 400 }
      )
    }

    // 대상 사용자 존재 확인
    const { data: targetUser, error: userError } = await supabase
      .from('users')
      .select('id, nickname, is_public')
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

    // 이미 팔로우 중인지 확인
    const { data: existingFriendship } = await supabase
      .from('friendships')
      .select('id, status')
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId)
      .single()

    if (existingFriendship) {
      if (existingFriendship.status === 'active') {
        return NextResponse.json(
          {
            error: {
              code: 'ALREADY_EXISTS',
              message: '이미 팔로우 중입니다.',
            },
          },
          { status: 409 }
        )
      }

      // blocked 상태인 경우 active로 변경
      if (existingFriendship.status === 'blocked') {
        const { error: updateError } = await supabase
          .from('friendships')
          .update({ status: 'active' })
          .eq('id', existingFriendship.id)

        if (updateError) {
          console.error('Error updating friendship:', updateError)
          return NextResponse.json(
            {
              error: {
                code: 'INTERNAL_ERROR',
                message: '팔로우 처리 중 오류가 발생했습니다.',
              },
            },
            { status: 500 }
          )
        }

        return NextResponse.json(
          {
            data: {
              message: '팔로우했습니다.',
              userId: targetUserId,
              nickname: targetUser.nickname,
            },
          },
          { status: 200 }
        )
      }
    }

    // 새로운 팔로우 관계 생성
    const { error: insertError } = await supabase.from('friendships').insert({
      follower_id: user.id,
      following_id: targetUserId,
      status: 'active',
    })

    if (insertError) {
      console.error('Error creating friendship:', insertError)
      return NextResponse.json(
        {
          error: {
            code: 'INTERNAL_ERROR',
            message: '팔로우 처리 중 오류가 발생했습니다.',
          },
        },
        { status: 500 }
      )
    }

    // 알림 생성 (선택적)
    await supabase.from('notifications').insert({
      user_id: targetUserId,
      type: 'friend_request',
      title: '새로운 팔로워',
      message: `${user.email?.split('@')[0] || '누군가'}님이 팔로우했습니다.`,
      data: { followerId: user.id },
    })

    return NextResponse.json(
      {
        data: {
          message: '팔로우했습니다.',
          userId: targetUserId,
          nickname: targetUser.nickname,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Unexpected error in POST /api/social/friends/[userId]:', error)
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

/**
 * DELETE /api/social/friends/[userId]
 * 친구 삭제 (언팔로우)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    // 팔로우 관계 확인 및 삭제
    const { data: existingFriendship, error: findError } = await supabase
      .from('friendships')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId)
      .eq('status', 'active')
      .single()

    if (findError || !existingFriendship) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: '팔로우 관계를 찾을 수 없습니다.',
          },
        },
        { status: 404 }
      )
    }

    // 팔로우 관계 삭제
    const { error: deleteError } = await supabase
      .from('friendships')
      .delete()
      .eq('id', existingFriendship.id)

    if (deleteError) {
      console.error('Error deleting friendship:', deleteError)
      return NextResponse.json(
        {
          error: {
            code: 'INTERNAL_ERROR',
            message: '언팔로우 처리 중 오류가 발생했습니다.',
          },
        },
        { status: 500 }
      )
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Unexpected error in DELETE /api/social/friends/[userId]:', error)
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
