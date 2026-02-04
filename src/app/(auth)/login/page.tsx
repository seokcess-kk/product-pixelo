'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PixelButton, PixelLogo } from '@/components/features/onboarding'
import { cn } from '@/lib/utils'

type OAuthProvider = 'kakao' | 'naver'
type AuthMode = 'login' | 'signup'

interface LoginError {
  provider?: OAuthProvider
  message: string
}

/**
 * 로그인 페이지 메인 컴포넌트
 * useSearchParams를 사용하므로 Suspense로 감싸야 합니다.
 */
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageSkeleton />}>
      <LoginPageContent />
    </Suspense>
  )
}

/**
 * 로딩 중 스켈레톤 UI
 */
function LoginPageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-primary-50/30 p-8">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-32 w-32 animate-pulse rounded bg-muted" />
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted" />
        </div>
        <div className="space-y-3">
          <div className="h-12 w-full animate-pulse bg-muted" />
          <div className="h-12 w-full animate-pulse bg-muted" />
        </div>
      </div>
    </div>
  )
}

/**
 * 로그인 페이지 실제 콘텐츠
 */
function LoginPageContent() {
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null)
  const [error, setError] = useState<LoginError | null>(null)
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()

  // URL 파라미터에서 에러 확인
  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam === 'auth_callback_error') {
      setError({ message: '로그인 중 오류가 발생했습니다. 다시 시도해 주세요.' })
    } else if (errorParam === 'access_denied') {
      setError({ message: '로그인이 취소되었습니다.' })
    }
  }, [searchParams])

  const handleOAuthLogin = async (provider: OAuthProvider) => {
    setLoadingProvider(provider)
    setError(null)
    setSuccessMessage(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as 'kakao',
        options: {
          redirectTo: `${window.location.origin}/callback`,
          queryParams: provider === 'kakao' ? {
            // 카카오 추가 스코프 (필요시)
            // scope: 'profile_nickname profile_image',
          } : undefined,
        },
      })

      if (error) {
        throw error
      }
    } catch (err) {
      console.error(`${provider} login error:`, err)
      setError({
        provider,
        message: err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.',
      })
      setLoadingProvider(null)
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsEmailLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      if (authMode === 'signup') {
        // 회원가입
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/callback`,
          },
        })

        if (error) {
          throw error
        }

        setSuccessMessage('회원가입 완료! 이메일을 확인해 주세요. (이메일 확인이 비활성화된 경우 바로 로그인 가능)')
        setAuthMode('login')
      } else {
        // 로그인
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          throw error
        }

        // 로그인 성공 시 리다이렉트
        router.push('/question')
      }
    } catch (err) {
      console.error(`Email ${authMode} error:`, err)
      setError({
        message: err instanceof Error ? err.message : `${authMode === 'signup' ? '회원가입' : '로그인'} 중 오류가 발생했습니다.`,
      })
    } finally {
      setIsEmailLoading(false)
    }
  }

  const handleGuestBrowse = () => {
    router.push('/question')
  }

  const isLoading = loadingProvider !== null || isEmailLoading

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-primary-50/30 p-8">
      <div className="w-full max-w-sm space-y-8">
        {/* 로고 및 헤더 */}
        <div className="flex flex-col items-center space-y-4">
          <div className="h-32 w-32">
            <PixelLogo className="h-full w-full" />
          </div>
          <div className="space-y-2 text-center">
            <h1 className="font-pixel text-pixel-title tracking-tight text-foreground">
              PIXELO
            </h1>
            <p className="text-body-sm text-muted-foreground">
              매일 질문, 나를 찾는 여정
            </p>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="animate-slide-up border-2 border-error bg-error-light p-4 text-center font-pixel text-pixel-caption text-error-dark">
            <span className="mr-2">!</span>
            {error.message}
          </div>
        )}

        {/* 성공 메시지 */}
        {successMessage && (
          <div className="animate-slide-up border-2 border-success bg-success-light p-4 text-center font-pixel text-pixel-caption text-success-dark">
            <span className="mr-2">✓</span>
            {successMessage}
          </div>
        )}

        {/* 이메일 로그인 폼 */}
        <div className="space-y-4">
          <form onSubmit={handleEmailAuth} className="space-y-3">
            <div>
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border-2 border-muted bg-background font-pixel text-pixel-body focus:border-primary-500 focus:outline-none disabled:opacity-50"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="비밀번호 (6자 이상)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading}
                className="w-full px-4 py-3 border-2 border-muted bg-background font-pixel text-pixel-body focus:border-primary-500 focus:outline-none disabled:opacity-50"
              />
            </div>
            <PixelButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              isLoading={isEmailLoading}
              className="w-full"
            >
              <EmailIcon className="mr-2 h-5 w-5" />
              {authMode === 'signup' ? '회원가입' : '이메일로 로그인'}
            </PixelButton>
          </form>

          {/* 모드 전환 */}
          <button
            type="button"
            onClick={() => {
              setAuthMode(authMode === 'login' ? 'signup' : 'login')
              setError(null)
              setSuccessMessage(null)
            }}
            disabled={isLoading}
            className="w-full text-center font-pixel text-pixel-caption text-primary-500 hover:text-primary-600 underline underline-offset-2 disabled:opacity-50"
          >
            {authMode === 'login' ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
          </button>
        </div>

        {/* 구분선 */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-muted" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gradient-to-b from-background to-primary-50/30 px-4 font-pixel text-pixel-caption text-muted-foreground">
              또는 소셜 로그인
            </span>
          </div>
        </div>

        {/* 소셜 로그인 버튼 */}
        <div className="space-y-3">
          {/* 카카오 로그인 */}
          <PixelButton
            variant="kakao"
            size="lg"
            onClick={() => handleOAuthLogin('kakao')}
            disabled={isLoading}
            isLoading={loadingProvider === 'kakao'}
            className="w-full"
          >
            <KakaoIcon className="mr-2 h-5 w-5" />
            카카오로 시작하기
          </PixelButton>

          {/* 네이버 로그인 */}
          <PixelButton
            variant="naver"
            size="lg"
            onClick={() => handleOAuthLogin('naver')}
            disabled={isLoading}
            isLoading={loadingProvider === 'naver'}
            className="w-full"
          >
            <NaverIcon className="mr-2 h-5 w-5" />
            네이버로 시작하기
          </PixelButton>

          {/* 구분선 */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gradient-to-b from-background to-primary-50/30 px-4 font-pixel text-pixel-caption text-muted-foreground">
                또는
              </span>
            </div>
          </div>

          {/* 게스트 둘러보기 */}
          <PixelButton
            variant="secondary"
            size="lg"
            onClick={handleGuestBrowse}
            disabled={isLoading}
            className="w-full"
          >
            <GuestIcon className="mr-2 h-5 w-5" />
            둘러보기
          </PixelButton>
        </div>

        {/* 이용약관 안내 */}
        <p className="text-center font-pixel text-pixel-caption text-muted-foreground">
          로그인 시{' '}
          <a href="/terms" className="text-primary-500 underline underline-offset-2 hover:text-primary-600">
            이용약관
          </a>
          {' '}및{' '}
          <a href="/privacy" className="text-primary-500 underline underline-offset-2 hover:text-primary-600">
            개인정보처리방침
          </a>
          에 동의하게 됩니다.
        </p>
      </div>
    </div>
  )
}

// 카카오 아이콘 컴포넌트 (픽셀 스타일)
function KakaoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ imageRendering: 'auto' }}
    >
      <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.76 1.8 5.16 4.5 6.54-.18.66-.66 2.4-.75 2.76-.12.48.18.48.36.36.15-.09 2.37-1.59 3.33-2.25.51.06 1.02.09 1.56.09 5.52 0 10-3.48 10-7.8S17.52 3 12 3z" />
    </svg>
  )
}

// 네이버 아이콘 컴포넌트 (픽셀 스타일)
function NaverIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ imageRendering: 'auto' }}
    >
      <path d="M16.273 12.845L7.376 3H3v18h4.727V11.155L16.624 21H21V3h-4.727v9.845z" />
    </svg>
  )
}

// 게스트 아이콘 컴포넌트
function GuestIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    </svg>
  )
}

// 이메일 아이콘 컴포넌트
function EmailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}
