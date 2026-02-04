'use client'

import Link from 'next/link'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { FriendWithProfile, UserSearchResult } from '@/types'

interface FriendCardProps {
  friend: FriendWithProfile
  showActions?: boolean
}

export function FriendCard({ friend, showActions = true }: FriendCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-muted/30">
      <Link
        href={`/friends/visit/${friend.id}`}
        className="flex flex-1 items-center gap-3"
      >
        <Avatar
          src={friend.avatarUrl}
          alt={friend.nickname}
          fallback={friend.nickname}
          size="default"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-medium">{friend.nickname}</p>
            {friend.isMutual && (
              <Badge variant="secondary" size="sm">
                맞팔
              </Badge>
            )}
          </div>
          {friend.bio && (
            <p className="truncate text-sm text-muted-foreground">{friend.bio}</p>
          )}
        </div>
      </Link>
      {showActions && (
        <div className="ml-4 flex shrink-0 gap-2">
          <Link href={`/friends/visit/${friend.id}`}>
            <Button variant="outline" size="sm">
              방문
            </Button>
          </Link>
          <Link href={`/friends/compare/${friend.id}`}>
            <Button size="sm">비교</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

interface SearchResultCardProps {
  user: UserSearchResult
  onFollow?: (userId: string) => Promise<void>
  onUnfollow?: (userId: string) => Promise<void>
  isLoading?: boolean
}

export function SearchResultCard({
  user,
  onFollow,
  onUnfollow,
  isLoading = false,
}: SearchResultCardProps) {
  const handleAction = async () => {
    if (user.isFollowing && onUnfollow) {
      await onUnfollow(user.id)
    } else if (!user.isFollowing && onFollow) {
      await onFollow(user.id)
    }
  }

  return (
    <div className="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-muted/30">
      <div className="flex flex-1 items-center gap-3">
        <Avatar
          src={user.avatarUrl}
          alt={user.nickname}
          fallback={user.nickname}
          size="default"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-medium">{user.nickname}</p>
            {user.isFollower && !user.isFollowing && (
              <Badge variant="outline" size="sm">
                나를 팔로우
              </Badge>
            )}
            {user.isFollowing && user.isFollower && (
              <Badge variant="secondary" size="sm">
                맞팔
              </Badge>
            )}
          </div>
          {user.bio && (
            <p className="truncate text-sm text-muted-foreground">{user.bio}</p>
          )}
        </div>
      </div>
      <div className="ml-4 shrink-0">
        <Button
          variant={user.isFollowing ? 'outline' : 'default'}
          size="sm"
          onClick={handleAction}
          disabled={isLoading}
        >
          {isLoading ? '...' : user.isFollowing ? '팔로잉' : '팔로우'}
        </Button>
      </div>
    </div>
  )
}
