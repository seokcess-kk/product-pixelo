'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

export default function MyPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setIsLoading(false)
    }
    getUser()
  }, [supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">마이페이지</h1>
        </div>

        {user && (
          <div className="space-y-4 rounded-lg border p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">이메일</p>
              <p className="font-medium">{user.email || '이메일 없음'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">가입일</p>
              <p className="font-medium">
                {new Date(user.created_at).toLocaleDateString('ko-KR')}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button className="w-full rounded-lg border px-6 py-3 font-medium transition-colors hover:bg-muted">
            설정
          </button>
          <button
            onClick={handleLogout}
            className="w-full rounded-lg border border-destructive px-6 py-3 font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  )
}
