'use client'

import { useState, useEffect, useCallback } from 'react'
import type { FriendsListResponse, FriendWithProfile, UserSearchResult, PaginatedResponse } from '@/types'

interface UseFriendsReturn {
  following: FriendWithProfile[]
  followers: FriendWithProfile[]
  mutualCount: number
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useFriends(): UseFriendsReturn {
  const [following, setFollowing] = useState<FriendWithProfile[]>([])
  const [followers, setFollowers] = useState<FriendWithProfile[]>([])
  const [mutualCount, setMutualCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFriends = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/social/friends')
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.message || '친구 목록을 불러오는 데 실패했습니다.')
      }

      const data = result.data as FriendsListResponse
      setFollowing(data.following)
      setFollowers(data.followers)
      setMutualCount(data.mutualCount)
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFriends()
  }, [fetchFriends])

  return {
    following,
    followers,
    mutualCount,
    isLoading,
    error,
    refetch: fetchFriends,
  }
}

interface UseFollowReturn {
  follow: (userId: string) => Promise<boolean>
  unfollow: (userId: string) => Promise<boolean>
  isFollowing: boolean
  isLoading: boolean
  error: string | null
}

export function useFollow(userId: string, initialIsFollowing = false): UseFollowReturn {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const follow = async (targetUserId: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/social/friends/${targetUserId}`, {
        method: 'POST',
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error?.message || '팔로우에 실패했습니다.')
      }

      setIsFollowing(true)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const unfollow = async (targetUserId: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/social/friends/${targetUserId}`, {
        method: 'DELETE',
      })

      if (!response.ok && response.status !== 204) {
        const result = await response.json()
        throw new Error(result.error?.message || '언팔로우에 실패했습니다.')
      }

      setIsFollowing(false)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setIsFollowing(initialIsFollowing)
  }, [initialIsFollowing])

  return {
    follow,
    unfollow,
    isFollowing,
    isLoading,
    error,
  }
}

interface UseUserSearchReturn {
  results: UserSearchResult[]
  isLoading: boolean
  error: string | null
  hasMore: boolean
  search: (query: string) => Promise<void>
  loadMore: () => Promise<void>
  reset: () => void
}

export function useUserSearch(): UseUserSearchReturn {
  const [results, setResults] = useState<UserSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentQuery, setCurrentQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const search = async (query: string) => {
    if (!query.trim()) {
      setResults([])
      setCurrentQuery('')
      setCurrentPage(1)
      setHasMore(false)
      return
    }

    setIsLoading(true)
    setError(null)
    setCurrentQuery(query)
    setCurrentPage(1)

    try {
      const response = await fetch(`/api/social/search?q=${encodeURIComponent(query)}&page=1&limit=20`)
      const result: PaginatedResponse<UserSearchResult> = await response.json()

      if (!response.ok) {
        throw new Error((result as unknown as { error?: { message?: string } }).error?.message || '검색에 실패했습니다.')
      }

      setResults(result.data)
      setHasMore(result.pagination.page < result.pagination.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const loadMore = async () => {
    if (!currentQuery || isLoading || !hasMore) return

    setIsLoading(true)
    const nextPage = currentPage + 1

    try {
      const response = await fetch(`/api/social/search?q=${encodeURIComponent(currentQuery)}&page=${nextPage}&limit=20`)
      const result: PaginatedResponse<UserSearchResult> = await response.json()

      if (!response.ok) {
        throw new Error((result as unknown as { error?: { message?: string } }).error?.message || '검색에 실패했습니다.')
      }

      setResults((prev) => [...prev, ...result.data])
      setCurrentPage(nextPage)
      setHasMore(result.pagination.page < result.pagination.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setResults([])
    setCurrentQuery('')
    setCurrentPage(1)
    setHasMore(false)
    setError(null)
  }

  return {
    results,
    isLoading,
    error,
    hasMore,
    search,
    loadMore,
    reset,
  }
}
