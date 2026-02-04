import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * GET /api/auth/me
 * 현재 로그인한 사용자 정보 및 프로필 조회
 */
export async function GET() {
  try {
    const supabase = await createClient()

    // 현재 사용자 확인
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: { code: 'NOT_AUTHENTICATED', message: '로그인이 필요합니다.' } },
        { status: 401 }
      )
    }

    // 프로필 조회
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // 프로필이 없는 경우 (신규 사용자)
    if (profileError && profileError.code === 'PGRST116') {
      return NextResponse.json({
        data: {
          user: {
            id: user.id,
            email: user.email,
            provider: user.app_metadata?.provider,
            createdAt: user.created_at,
          },
          profile: null,
          isNewUser: true,
        },
      })
    }

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json(
        { error: { code: 'PROFILE_FETCH_ERROR', message: '프로필 조회에 실패했습니다.' } },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: {
        user: {
          id: user.id,
          email: user.email,
          provider: user.app_metadata?.provider,
          createdAt: user.created_at,
        },
        profile: {
          id: profile.id,
          userId: profile.user_id,
          nickname: profile.nickname,
          avatarUrl: profile.avatar_url,
          createdAt: profile.created_at,
          updatedAt: profile.updated_at,
        },
        isNewUser: false,
      },
    })
  } catch (err) {
    console.error('Auth me error:', err)
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다.' } },
      { status: 500 }
    )
  }
}
