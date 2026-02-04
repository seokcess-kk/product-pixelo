import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/onboarding'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // 신규 사용자인지 확인하여 적절한 페이지로 리다이렉트
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // TODO: 사용자 프로필이 있는지 확인하여 온보딩/메인 분기
        const forwardedHost = request.headers.get('x-forwarded-host')
        const isLocalEnv = process.env.NODE_ENV === 'development'

        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}${next}`)
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${next}`)
        } else {
          return NextResponse.redirect(`${origin}${next}`)
        }
      }
    }
  }

  // OAuth 에러 발생 시 에러 페이지로 리다이렉트
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
