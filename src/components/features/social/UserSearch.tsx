'use client'

import { useState, useCallback, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { SearchResultCard } from './FriendCard'
import { useUserSearch } from '@/hooks/useFriends'

interface UserSearchProps {
  onFollowChange?: () => void
}

export function UserSearch({ onFollowChange }: UserSearchProps) {
  const [query, setQuery] = useState('')
  const [followLoadingId, setFollowLoadingId] = useState<string | null>(null)
  const { results, isLoading, error, search, reset } = useUserSearch()

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        search(query)
      } else {
        reset()
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, search, reset])

  const handleFollow = useCallback(async (userId: string) => {
    setFollowLoadingId(userId)
    try {
      const response = await fetch(`/api/social/friends/${userId}`, {
        method: 'POST',
      })

      if (response.ok) {
        // Re-search to update the results
        search(query)
        onFollowChange?.()
      }
    } catch (err) {
      console.error('Follow error:', err)
    } finally {
      setFollowLoadingId(null)
    }
  }, [query, search, onFollowChange])

  const handleUnfollow = useCallback(async (userId: string) => {
    setFollowLoadingId(userId)
    try {
      const response = await fetch(`/api/social/friends/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok || response.status === 204) {
        // Re-search to update the results
        search(query)
        onFollowChange?.()
      }
    } catch (err) {
      console.error('Unfollow error:', err)
    } finally {
      setFollowLoadingId(null)
    }
  }, [query, search, onFollowChange])

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          type="search"
          placeholder="닉네임으로 검색 (2글자 이상)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-10"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Spinner size="sm" />
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {query.length >= 2 && !isLoading && results.length === 0 && (
        <div className="py-8 text-center text-muted-foreground">
          <p>검색 결과가 없어요</p>
          <p className="mt-1 text-sm">다른 닉네임으로 검색해보세요</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((user) => (
            <SearchResultCard
              key={user.id}
              user={user}
              onFollow={handleFollow}
              onUnfollow={handleUnfollow}
              isLoading={followLoadingId === user.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
