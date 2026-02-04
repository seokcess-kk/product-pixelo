'use client'

import { useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/stores'
import { useRouter } from 'next/navigation'
import type { UserProfile } from '@/types'

type OAuthProvider = 'kakao' | 'naver'

interface SignInWithOAuthOptions {
  redirectTo?: string
}

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
    setProfile,
    setLoading,
    setInitialized,
    reset,
  } = useAuthStore()
  const supabase = createClient()
  const router = useRouter()

  /**
   * 사용자 프로필 로드
   */
  const loadProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        // 프로필이 없는 경우는 에러가 아님 (신규 사용자)
        if (error.code === 'PGRST116') {
          return null
        }
        console.error('Profile fetch error:', error)
        return null
      }

      // DB 스키마에서 프론트엔드 타입으로 변환
      const userProfile: UserProfile = {
        id: data.id,
        userId: data.user_id,
        nickname: data.nickname,
        avatarUrl: data.avatar_url ?? undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }

      return userProfile
    } catch (err) {
      console.error('Profile load error:', err)
      return null
    }
  }, [supabase])

  useEffect(() => {
    // 초기 세션 확인
    const initializeAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        // 사용자가 있으면 프로필도 로드
        if (user) {
          const userProfile = await loadProfile(user.id)
          setProfile(userProfile)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setUser(null)
        setProfile(null)
      } finally {
        setLoading(false)
        setInitialized(true)
      }
    }

    initializeAuth()

    // 인증 상태 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)

        if (event === 'SIGNED_IN' && currentUser) {
          // 로그인 시 프로필 로드
          const userProfile = await loadProfile(currentUser.id)
          setProfile(userProfile)
        } else if (event === 'SIGNED_OUT') {
          // 로그아웃 시 상태 초기화
          reset()
          router.push('/login')
        } else if (event === 'USER_UPDATED' && currentUser) {
          // 사용자 정보 업데이트 시 프로필 다시 로드
          const userProfile = await loadProfile(currentUser.id)
          setProfile(userProfile)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth, setUser, setProfile, setLoading, setInitialized, reset, router, loadProfile])

  /**
   * OAuth 로그인
   */
  const signInWithOAuth = useCallback(async (
    provider: OAuthProvider,
    options?: SignInWithOAuthOptions
  ) => {
    const redirectTo = options?.redirectTo ?? `${window.location.origin}/callback`

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    })

    if (error) {
      throw error
    }
  }, [supabase.auth])

  /**
   * 카카오 로그인
   */
  const signInWithKakao = useCallback(async (options?: SignInWithOAuthOptions) => {
    return signInWithOAuth('kakao', options)
  }, [signInWithOAuth])

  /**
   * 네이버 로그인
   */
  const signInWithNaver = useCallback(async (options?: SignInWithOAuthOptions) => {
    return signInWithOAuth('naver', options)
  }, [signInWithOAuth])

  /**
   * 로그아웃
   */
  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }, [supabase.auth])

  /**
   * 프로필 새로고침
   */
  const refreshProfile = useCallback(async () => {
    if (!user) return null

    const userProfile = await loadProfile(user.id)
    setProfile(userProfile)
    return userProfile
  }, [user, loadProfile, setProfile])

  return {
    // 상태
    user,
    profile,
    isLoading,
    isInitialized,
    isAuthenticated: !!user,
    hasProfile: !!profile?.nickname,

    // 액션
    signInWithOAuth,
    signInWithKakao,
    signInWithNaver,
    signOut,
    refreshProfile,
  }
}
