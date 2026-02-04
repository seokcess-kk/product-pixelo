'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleKakaoLogin = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${window.location.origin}/callback`,
        },
      })
      if (error) throw error
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">PIXELO</h1>
          <p className="mt-2 text-muted-foreground">
            나만의 감성 공간에 오신 것을 환영합니다
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleKakaoLogin}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FEE500] px-4 py-3 font-medium text-[#191919] transition-colors hover:bg-[#FEE500]/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? '로그인 중...' : '카카오로 시작하기'}
          </button>
        </div>
      </div>
    </div>
  )
}
