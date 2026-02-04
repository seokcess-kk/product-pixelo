import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

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

  // 보호된 경로 체크 (필요시 주석 해제)
  // const protectedRoutes = ['/mypage', '/question', '/space']
  // const isProtectedRoute = protectedRoutes.some(route =>
  //   request.nextUrl.pathname.startsWith(route)
  // )
  //
  // if (!user && isProtectedRoute) {
  //   const url = request.nextUrl.clone()
  //   url.pathname = '/login'
  //   return NextResponse.redirect(url)
  // }

  return supabaseResponse
}
