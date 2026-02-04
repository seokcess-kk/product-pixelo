'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { FriendCard } from '@/components/features/social/FriendCard'
import { UserSearch } from '@/components/features/social/UserSearch'
import { useFriends } from '@/hooks/useFriends'

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState('following')
  const [showSearch, setShowSearch] = useState(false)
  const { following, followers, mutualCount, isLoading, error, refetch } = useFriends()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="text-center">
          <h2 className="mb-2 text-lg font-medium">오류가 발생했어요</h2>
          <p className="mb-4 text-muted-foreground">{error}</p>
          <Button onClick={refetch}>다시 시도</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="mr-2">
              <Button variant="ghost" size="icon" aria-label="뒤로가기">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">친구</h1>
          </div>
          <Button
            variant={showSearch ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setShowSearch(!showSearch)}
            aria-label="친구 검색"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {showSearch ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <>
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </>
              )}
            </svg>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        {/* Search Section */}
        {showSearch && (
          <div className="mb-6">
            <h2 className="mb-3 text-sm font-medium text-muted-foreground">
              친구 찾기
            </h2>
            <UserSearch onFollowChange={refetch} />
          </div>
        )}

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-lg border bg-card p-4 text-center">
            <p className="text-2xl font-semibold text-primary">{following.length}</p>
            <p className="text-sm text-muted-foreground">팔로잉</p>
          </div>
          <div className="rounded-lg border bg-card p-4 text-center">
            <p className="text-2xl font-semibold text-primary">{followers.length}</p>
            <p className="text-sm text-muted-foreground">팔로워</p>
          </div>
          <div className="rounded-lg border bg-card p-4 text-center">
            <p className="text-2xl font-semibold text-primary">{mutualCount}</p>
            <p className="text-sm text-muted-foreground">맞팔</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="following" className="flex-1">
              팔로잉 ({following.length})
            </TabsTrigger>
            <TabsTrigger value="followers" className="flex-1">
              팔로워 ({followers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="following">
            {following.length === 0 ? (
              <EmptyState
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" x2="19" y1="8" y2="14" />
                    <line x1="22" x2="16" y1="11" y2="11" />
                  </svg>
                }
                title="아직 팔로우한 친구가 없어요"
                description="친구를 검색해서 팔로우해보세요"
                action={
                  <Button onClick={() => setShowSearch(true)}>친구 찾기</Button>
                }
              />
            ) : (
              <div className="space-y-2">
                {following.map((friend) => (
                  <FriendCard key={friend.id} friend={friend} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="followers">
            {followers.length === 0 ? (
              <EmptyState
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                }
                title="아직 팔로워가 없어요"
                description="공간을 꾸미고 친구들에게 공유해보세요"
              />
            ) : (
              <div className="space-y-2">
                {followers.map((friend) => (
                  <FriendCard key={friend.id} friend={friend} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
