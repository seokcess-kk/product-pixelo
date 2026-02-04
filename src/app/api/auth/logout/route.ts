import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * POST /api/auth/logout
 * 서버 사이드 로그아웃 처리
 *
 * 클라이언트에서 supabase.auth.signOut()을 호출해도 되지만,
 * 서버 사이드에서 로그아웃을 처리하면 쿠키가 확실하게 제거됩니다.
 */
export async function POST() {
  try {
    const supabase = await createClient()

    // 현재 세션 확인
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: { code: 'NOT_AUTHENTICATED', message: '로그인 상태가 아닙니다.' } },
        { status: 401 }
      )
    }

    // 로그아웃 수행
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error)
      return NextResponse.json(
        { error: { code: 'LOGOUT_FAILED', message: '로그아웃에 실패했습니다.' } },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data: { message: '로그아웃되었습니다.' } },
      { status: 200 }
    )
  } catch (err) {
    console.error('Logout error:', err)
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다.' } },
      { status: 500 }
    )
  }
}
