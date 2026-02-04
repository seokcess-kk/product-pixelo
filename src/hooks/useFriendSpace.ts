'use client'

import { useState, useEffect, useCallback } from 'react'
import type { FriendSpace } from '@/types'

interface UseFriendSpaceReturn {
  space: FriendSpace | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useFriendSpace(userId: string): UseFriendSpaceReturn {
  const [space, setSpace] = useState<FriendSpace | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSpace = useCallback(async () => {
    if (!userId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/social/visit/${userId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.message || '공간을 불러오는 데 실패했습니다.')
      }

      setSpace(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchSpace()
  }, [fetchSpace])

  return {
    space,
    isLoading,
    error,
    refetch: fetchSpace,
  }
}
