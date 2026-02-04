'use client'

import { use } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Spinner } from '@/components/ui/Spinner'
import { Badge } from '@/components/ui/Badge'
import { RadarChart } from '@/components/features/social/RadarChart'
import { useCompare, getCompatibilityGrade } from '@/hooks/useCompare'

interface ComparePageProps {
  params: Promise<{
    userId: string
  }>
}

export default function ComparePage({ params }: ComparePageProps) {
  const resolvedParams = use(params)
  const { userId } = resolvedParams
  const { data, isLoading, error } = useCompare(userId)

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

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="text-center">
          <h2 className="mb-2 text-lg font-medium">비교 데이터가 없어요</h2>
          <p className="mb-4 text-muted-foreground">
            아직 충분한 데이터가 수집되지 않았어요
          </p>
          <Link href="/friends">
            <Button>친구 목록으로</Button>
          </Link>
        </div>
      </div>
    )
  }

  const { grade, message, color } = getCompatibilityGrade(data.overallSimilarity)
  const similarAxes = data.similarities.filter((s) => s.isSimilar && s.scoreDifference >= 0)
  const differentAxes = data.similarities.filter((s) => !s.isSimilar && s.scoreDifference >= 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href={`/friends/visit/${userId}`}>
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
            <h1 className="text-lg font-semibold">성향 비교</h1>
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

      <main className="mx-auto max-w-2xl px-4 py-6">
        {/* Profile Comparison */}
        <div className="mb-6 flex items-center justify-center gap-8">
          <div className="flex flex-col items-center">
            <Avatar size="xl" fallback="나" />
            <p className="mt-2 font-medium">나</p>
          </div>
          <div className="text-2xl font-bold text-muted-foreground">VS</div>
          <div className="flex flex-col items-center">
            <Avatar
              src={data.friendInfo.avatarUrl}
              alt={data.friendInfo.nickname}
              fallback={data.friendInfo.nickname}
              size="xl"
            />
            <p className="mt-2 font-medium">{data.friendInfo.nickname}</p>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="mb-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-center text-lg font-medium">7축 성향 비교</h2>
          <RadarChart
            myScores={data.myScores}
            friendScores={data.friendScores}
            size={280}
          />
        </div>

        {/* Compatibility Score */}
        <div className="mb-6 rounded-xl border bg-card p-6 text-center shadow-sm">
          <p className="mb-2 text-sm text-muted-foreground">궁합 점수</p>
          <p className="mb-1 text-4xl font-bold text-primary">
            {data.overallSimilarity}%
          </p>
          <Badge variant="secondary" className={color}>
            {grade}
          </Badge>
          <p className="mt-2 text-muted-foreground">{message}</p>
        </div>

        {/* Similarities */}
        {similarAxes.length > 0 && (
          <div className="mb-4 rounded-xl border bg-card p-4 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 font-medium">
              <span className="text-success">{"///"}</span>
              비슷한 점
            </h3>
            <ul className="space-y-2">
              {similarAxes.map((axis) => (
                <li
                  key={axis.axisCode}
                  className="flex items-center gap-2 text-sm"
                >
                  <span className="h-2 w-2 rounded-full bg-success" />
                  <span>{axis.axisName}</span>
                  <span className="ml-auto text-muted-foreground">
                    차이: {axis.scoreDifference.toFixed(1)}점
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Differences */}
        {differentAxes.length > 0 && (
          <div className="mb-6 rounded-xl border bg-card p-4 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 font-medium">
              <span className="text-warning">{"~~~"}</span>
              다른 점
            </h3>
            <ul className="space-y-2">
              {differentAxes.map((axis) => (
                <li
                  key={axis.axisCode}
                  className="flex items-center gap-2 text-sm"
                >
                  <span className="h-2 w-2 rounded-full bg-warning" />
                  <span>{axis.axisName}</span>
                  <span className="ml-auto text-muted-foreground">
                    차이: {axis.scoreDifference.toFixed(1)}점
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Score Details */}
        <div className="mb-6 rounded-xl border bg-card p-4 shadow-sm">
          <h3 className="mb-3 font-medium">상세 점수</h3>
          <div className="space-y-4">
            {data.myScores.map((myScore, index) => {
              const friendScore = data.friendScores[index]
              const myValue = myScore.finalScore ?? myScore.averageScore ?? 0
              const friendValue = friendScore?.finalScore ?? friendScore?.averageScore ?? 0

              return (
                <div key={myScore.axisId} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{myScore.axisName}</span>
                    <span className="text-muted-foreground">
                      {myScore.lowEndName} - {myScore.highEndName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-xs text-primary">나: {myValue.toFixed(1)}</span>
                    <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="absolute h-full bg-primary transition-all"
                        style={{ width: `${((myValue - 1) / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-16 text-xs"
                      style={{ color: 'hsl(24 95% 53%)' }}
                    >
                      친구: {friendValue.toFixed(1)}
                    </span>
                    <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="absolute h-full transition-all"
                        style={{
                          width: `${((friendValue - 1) / 4) * 100}%`,
                          backgroundColor: 'hsl(24 95% 53%)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Share Button */}
        <div className="flex justify-center">
          <Button size="lg" className="w-full max-w-sm">
            비교 카드 공유하기
          </Button>
        </div>
      </main>
    </div>
  )
}
