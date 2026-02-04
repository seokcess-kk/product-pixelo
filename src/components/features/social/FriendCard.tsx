import Link from 'next/link'
import type { UserProfile } from '@/types'

interface FriendCardProps {
  friend: UserProfile
}

export function FriendCard({ friend }: FriendCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-muted" />
        <div>
          <p className="font-medium">{friend.nickname}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Link
          href={`/friends/visit/${friend.userId}`}
          className="rounded-lg border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
        >
          방문
        </Link>
        <Link
          href={`/friends/compare/${friend.userId}`}
          className="rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
        >
          비교
        </Link>
      </div>
    </div>
  )
}
