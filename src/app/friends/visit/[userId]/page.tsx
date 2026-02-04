'use client'

import { use } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Spinner } from '@/components/ui/Spinner'
import { ReactionButton } from '@/components/features/social/ReactionButton'
import { useFriendSpace } from '@/hooks/useFriendSpace'

interface VisitPageProps {
  params: Promise<{
    userId: string
  }>
}

export default function VisitPage({ params }: VisitPageProps) {
  const resolvedParams = use(params)
  const { userId } = resolvedParams
  const { space, isLoading, error } = useFriendSpace(userId)

  const handleReaction = async (emoji: string) => {
    // TODO: Implement reaction API
    console.log('Reacted with:', emoji)
    // await fetch(`/api/social/reactions/${userId}`, {
    //   method: 'POST',
    //   body: JSON.stringify({ emoji }),
    // })
  }

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
          <Link href="/friends">
            <Button>친구 목록으로</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!space) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="text-center">
          <h2 className="mb-2 text-lg font-medium">공간을 찾을 수 없어요</h2>
          <p className="mb-4 text-muted-foreground">
            이 친구의 공간이 비공개이거나 아직 만들어지지 않았어요
          </p>
          <Link href="/friends">
            <Button>친구 목록으로</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Calculate completion percentage
  const objectCount = space.layout?.length || 0
  const maxObjects = 20
  const completionPercent = Math.min(Math.round((objectCount / maxObjects) * 100), 100)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/friends">
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
            <div className="flex items-center gap-2">
              <Avatar
                src={space.user.avatarUrl}
                alt={space.user.nickname}
                fallback={space.user.nickname}
                size="sm"
              />
              <span className="font-medium">{space.user.nickname}의 공간</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" aria-label="공유하기">
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
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" x2="12" y1="2" y2="15" />
            </svg>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        {/* Space View */}
        <div className="mb-6 overflow-hidden rounded-xl border bg-card shadow-sm">
          <div
            className="relative aspect-square w-full"
            style={{
              backgroundColor: space.backgroundVariant || '#f5f5f5',
              backgroundImage: space.season.spaceBackgroundUrl
                ? `url(${space.season.spaceBackgroundUrl})`
                : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Objects */}
            {space.objects && space.objects.length > 0 ? (
              space.layout.map((placement, index) => {
                const obj = space.objects.find((o) => o.id === placement.objectId)
                if (!obj) return null

                return (
                  <div
                    key={`${placement.objectId}-${index}`}
                    className="absolute cursor-pointer transition-transform hover:scale-105"
                    style={{
                      left: `${placement.x}%`,
                      top: `${placement.y}%`,
                      transform: `translate(-50%, -50%) scale(${placement.scale}) rotate(${placement.rotation}deg)`,
                      zIndex: placement.zIndex || obj.layerOrder,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={obj.imageUrl}
                      alt={obj.name}
                      className="max-h-24 max-w-24 object-contain"
                      style={{
                        width: obj.width ? `${obj.width}px` : 'auto',
                        height: obj.height ? `${obj.height}px` : 'auto',
                      }}
                    />
                  </div>
                )
              })
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <p>아직 배치된 오브젝트가 없어요</p>
              </div>
            )}
          </div>
        </div>

        {/* Space Info */}
        <div className="mb-6 rounded-lg border bg-card p-4">
          <h2 className="mb-2 font-medium">{space.season.name}</h2>
          <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
            <span>완성도</span>
            <span>{completionPercent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            오브젝트: {objectCount}/{maxObjects}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href={`/friends/compare/${userId}`} className="w-full sm:w-auto">
            <Button size="lg" className="w-full">
              성향 비교하기
            </Button>
          </Link>
          <ReactionButton onReact={handleReaction} />
        </div>
      </main>
    </div>
  )
}
