import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * OAuth 콜백 처리 라우트
 *
 * 1. OAuth 코드를 세션으로 교환
 * 2. 사용자 프로필 존재 여부 확인
 * 3. 프로필이 있으면 메인으로, 없으면 온보딩으로 리다이렉트
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // OAuth 제공자가 에러를 반환한 경우
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    const errorCode = error === 'access_denied' ? 'access_denied' : 'auth_callback_error'
    return redirectToLogin(request, origin, errorCode)
  }

  // 코드가 없는 경우
  if (!code) {
    console.error('No code in callback')
    return redirectToLogin(request, origin, 'auth_callback_error')
  }

  try {
    const supabase = await createClient()

    // 코드를 세션으로 교환
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Exchange error:', exchangeError)
      return redirectToLogin(request, origin, 'auth_callback_error')
    }

    // 현재 사용자 정보 가져오기
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('User fetch error:', userError)
      return redirectToLogin(request, origin, 'auth_callback_error')
    }

    // 사용자 프로필 확인하여 리다이렉트 경로 결정
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, nickname')
      .eq('user_id', user.id)
      .single()

    // 프로필이 존재하고 닉네임이 설정되어 있으면 메인으로
    // 그렇지 않으면 온보딩으로
    let redirectPath = '/onboarding'

    if (!profileError && profile?.nickname) {
      // next 파라미터가 있으면 해당 경로로, 없으면 메인으로
      const nextPath = searchParams.get('next')
      redirectPath = nextPath ?? '/'
    }

    return redirectToDestination(request, origin, redirectPath)

  } catch (err) {
    console.error('Callback error:', err)
    return redirectToLogin(request, origin, 'auth_callback_error')
  }
}

/**
 * 로그인 페이지로 리다이렉트
 */
function redirectToLogin(request: Request, origin: string, errorCode: string): NextResponse {
  const url = getRedirectUrl(request, origin, `/login?error=${errorCode}`)
  return NextResponse.redirect(url)
}

/**
 * 목적지로 리다이렉트
 */
function redirectToDestination(request: Request, origin: string, path: string): NextResponse {
  const url = getRedirectUrl(request, origin, path)
  return NextResponse.redirect(url)
}

/**
 * 환경에 맞는 리다이렉트 URL 생성
 */
function getRedirectUrl(request: Request, origin: string, path: string): string {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const isLocalEnv = process.env.NODE_ENV === 'development'

  if (isLocalEnv) {
    return `${origin}${path}`
  }

  if (forwardedHost) {
    return `https://${forwardedHost}${path}`
  }

  return `${origin}${path}`
}
