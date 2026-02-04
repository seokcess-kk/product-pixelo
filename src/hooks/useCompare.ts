'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ComparisonData } from '@/types'

interface UseCompareReturn {
  data: ComparisonData | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useCompare(userId: string): UseCompareReturn {
  const [data, setData] = useState<ComparisonData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCompare = useCallback(async () => {
    if (!userId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/social/compare/${userId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.message || '비교 데이터를 불러오는 데 실패했습니다.')
      }

      setData(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchCompare()
  }, [fetchCompare])

  return {
    data,
    isLoading,
    error,
    refetch: fetchCompare,
  }
}

// 궁합 등급 및 메시지 계산
export function getCompatibilityGrade(score: number): { grade: string; message: string; color: string } {
  if (score >= 90) {
    return { grade: '찰떡궁합', message: '운명적인 만남!', color: 'text-pixel-heart' }
  }
  if (score >= 75) {
    return { grade: '잘 맞아요', message: '서로 잘 통해요', color: 'text-success' }
  }
  if (score >= 60) {
    return { grade: '좋은 사이', message: '비슷한 점도, 다른 점도 있어요', color: 'text-primary' }
  }
  if (score >= 45) {
    return { grade: '다양한 매력', message: '서로 다른 매력이 있는 사이', color: 'text-info' }
  }
  if (score >= 30) {
    return { grade: '흥미로운 조합', message: '다름에서 배우는 사이', color: 'text-warning' }
  }
  return { grade: '정반대 성향', message: '완전 다른 세계에서 온 둘', color: 'text-muted-foreground' }
}
