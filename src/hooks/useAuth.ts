'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/stores'
import { useRouter } from 'next/navigation'

/**
 * 인증 상태 관리 훅
 * 사용자의 로그인 상태를 관리하고 Zustand 스토어와 동기화합니다.
 */
export function useAuth() {
  const {
    user,
    profile,
    isLoading,
    isInitialized,
    setUser,
    setLoading,
    setInitialized,
  } = useAuthStore()
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    // 초기 세션 확인
    const initializeAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Auth initialization error:', error)
        setUser(null)
      } finally {
        setLoading(false)
        setInitialized(true)
      }
    }

    initializeAuth()

    // 인증 상태 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)

        if (event === 'SIGNED_OUT') {
          router.push('/login')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth, setUser, setLoading, setInitialized, router])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return {
    user,
    profile,
    isLoading,
    isInitialized,
    isAuthenticated: !!user,
    signOut,
  }
}
