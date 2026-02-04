import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * 보호된 라우트 목록
 * 인증이 필요한 경로들
 */
const PROTECTED_ROUTES = [
  '/mypage',
  '/question',
  '/space',
  '/friends',
  '/onboarding',
]

/**
 * 인증된 사용자가 접근하면 안 되는 라우트
 * 로그인 상태에서 접근 시 메인으로 리다이렉트
 */
const AUTH_ROUTES = [
  '/login',
]

/**
 * 미들웨어용 Supabase 클라이언트
 * 세션 갱신 및 인증 체크에 사용합니다.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 세션 갱신 - getUser()를 호출하여 세션을 확인하고 갱신합니다.
  // 중요: createServerClient 직후 바로 호출해야 합니다.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // 보호된 경로 체크 - 인증되지 않은 사용자는 로그인으로 리다이렉트
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  )

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    // 로그인 후 원래 페이지로 돌아갈 수 있도록 next 파라미터 추가
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  // 인증 라우트 체크 - 이미 로그인된 사용자는 메인으로 리다이렉트
  const isAuthRoute = AUTH_ROUTES.some(route =>
    pathname.startsWith(route)
  )

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
