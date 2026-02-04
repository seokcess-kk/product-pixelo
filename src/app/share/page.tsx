'use client'

import { useRef, useState, useCallback, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SharePreview } from '@/components/features/share/SharePreview'
import { ShareActions } from '@/components/features/share/ShareActions'
import { ShareCardSize } from '@/types/share'
import {
  downloadElementAsImage,
  generateShareUrl,
  shareToKakao,
  generateOgImageUrl,
} from '@/lib/share-utils'
import type { AxisScoreData } from '@/lib/score-calculator'
import type { PlacedObject } from '@/components/features/space/SpaceGrid'
import { Spinner } from '@/components/ui/Spinner'

// =============================================================================
// Types
// =============================================================================

interface SharePageContentProps {
  initialUserId?: string
  initialSeasonId?: string
}

// =============================================================================
// Mock Data (실제 구현시 API에서 가져옴)
// =============================================================================

const MOCK_USER_DATA = {
  nickname: '픽셀러버',
  avatarUrl: undefined,
  seasonName: '봄의 시작',
  seasonNumber: 1,
  gridSize: 10,
  backgroundUrl: undefined,
}

const MOCK_AXIS_SCORES: AxisScoreData[] = [
  { axisCode: 'energy', totalScore: 18, answerCount: 5, averageScore: 3.6, finalScore: 4 },
  { axisCode: 'lifestyle', totalScore: 12, answerCount: 5, averageScore: 2.4, finalScore: 2 },
  { axisCode: 'emotion', totalScore: 20, answerCount: 5, averageScore: 4.0, finalScore: 4 },
  { axisCode: 'aesthetic', totalScore: 15, answerCount: 5, averageScore: 3.0, finalScore: 3 },
  { axisCode: 'social', totalScore: 22, answerCount: 5, averageScore: 4.4, finalScore: 4 },
  { axisCode: 'challenge', totalScore: 10, answerCount: 5, averageScore: 2.0, finalScore: 2 },
  { axisCode: 'relationship', totalScore: 17, answerCount: 5, averageScore: 3.4, finalScore: 3 },
]

const MOCK_PLACED_OBJECTS: PlacedObject[] = [
  {
    objectId: 'obj-1',
    x: 2,
    y: 2,
    scale: 1,
    rotation: 0,
    zIndex: 1,
    object: {
      id: 'obj-1',
      seasonId: 'season-1',
      categoryId: 'cat-1',
      name: '책상',
      imageUrl: '',
      defaultX: 2,
      defaultY: 2,
      isMovable: true,
      isResizable: false,
      acquisitionType: 'default',
      width: 2,
      height: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  {
    objectId: 'obj-2',
    x: 5,
    y: 3,
    scale: 1,
    rotation: 0,
    zIndex: 2,
    object: {
      id: 'obj-2',
      seasonId: 'season-1',
      categoryId: 'cat-2',
      name: '화분',
      imageUrl: '',
      defaultX: 5,
      defaultY: 3,
      isMovable: true,
      isResizable: false,
      acquisitionType: 'axis_score',
      width: 1,
      height: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  {
    objectId: 'obj-3',
    x: 7,
    y: 6,
    scale: 1,
    rotation: 0,
    zIndex: 3,
    object: {
      id: 'obj-3',
      seasonId: 'season-1',
      categoryId: 'cat-3',
      name: '램프',
      imageUrl: '',
      defaultX: 7,
      defaultY: 6,
      isMovable: true,
      isResizable: false,
      acquisitionType: 'day',
      width: 1,
      height: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
]

// =============================================================================
// Share Page Content Component
// =============================================================================

function SharePageContent({ initialUserId, initialSeasonId }: SharePageContentProps) {
  const searchParams = useSearchParams()
  const shareCardRef = useRef<HTMLDivElement>(null)

  const [selectedSize, setSelectedSize] = useState<ShareCardSize>(ShareCardSize.SQUARE)
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState(MOCK_USER_DATA)
  const [axisScores, setAxisScores] = useState<AxisScoreData[]>(MOCK_AXIS_SCORES)
  const [placedObjects, setPlacedObjects] = useState<PlacedObject[]>(MOCK_PLACED_OBJECTS)

  // URL 파라미터에서 사용자 정보 가져오기
  const userId = initialUserId ?? searchParams.get('user') ?? 'demo-user'
  const seasonId = initialSeasonId ?? searchParams.get('season') ?? 'demo-season'

  // 공유 URL
  const shareUrl = generateShareUrl(userId, seasonId)

  // 데이터 로딩 (실제 구현시 API 호출)
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // TODO: API에서 실제 데이터 가져오기
        // const response = await fetch(`/api/share?user=${userId}&season=${seasonId}`)
        // const data = await response.json()
        // setUserData(data.user)
        // setAxisScores(data.scores)
        // setPlacedObjects(data.objects)

        // Mock 데이터 사용 (지연 시뮬레이션)
        await new Promise((resolve) => setTimeout(resolve, 500))
      } catch (error) {
        console.error('Failed to load share data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [userId, seasonId])

  // 이미지 저장 핸들러
  const handleSaveImage = useCallback(
    async (size: ShareCardSize) => {
      if (!shareCardRef.current) return

      const success = await downloadElementAsImage(
        shareCardRef.current,
        size,
        `pixelo-${userData.nickname}-${Date.now()}.png`
      )

      if (!success) {
        throw new Error('이미지 저장에 실패했습니다.')
      }
    },
    [userData.nickname]
  )

  // 카카오 공유 핸들러
  const handleShareKakao = useCallback(async () => {
    const ogImageUrl = generateOgImageUrl(userId, seasonId)

    const success = await shareToKakao({
      title: `${userData.nickname}님의 픽셀 공간`,
      description: `${userData.seasonName} - 나만의 픽셀 공간을 구경해보세요!`,
      imageUrl: ogImageUrl,
      linkUrl: shareUrl,
      buttonTitle: '공간 구경하기',
    })

    if (!success) {
      throw new Error('카카오 공유에 실패했습니다.')
    }
  }, [userId, seasonId, userData, shareUrl])

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-muted-foreground">공유 카드 준비 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary-50 to-white p-4 md:p-8">
      <div className="w-full max-w-lg space-y-8">
        {/* 헤더 */}
        <div className="space-y-2 text-center">
          <h1 className="font-pixel text-2xl text-primary-500">공간 공유하기</h1>
          <p className="text-muted-foreground">
            나만의 픽셀 공간을 친구들과 공유해보세요
          </p>
        </div>

        {/* 카드 크기 선택 */}
        <div className="flex justify-center gap-2">
          {[
            { size: ShareCardSize.SQUARE, label: '정사각형' },
            { size: ShareCardSize.STORY, label: '스토리' },
            { size: ShareCardSize.OG, label: '링크 미리보기' },
          ].map(({ size, label }) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                selectedSize === size
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 공유 카드 미리보기 */}
        <div className="flex justify-center">
          <SharePreview
            ref={shareCardRef}
            nickname={userData.nickname}
            avatarUrl={userData.avatarUrl}
            seasonName={userData.seasonName}
            seasonNumber={userData.seasonNumber}
            placedObjects={placedObjects}
            axisScores={axisScores}
            gridSize={userData.gridSize}
            backgroundUrl={userData.backgroundUrl}
            size={selectedSize}
          />
        </div>

        {/* 공유 액션 버튼 */}
        <ShareActions
          shareUrl={shareUrl}
          onSaveImage={handleSaveImage}
          onShareKakao={handleShareKakao}
        />

        {/* 안내 텍스트 */}
        <p className="text-center text-xs text-muted-foreground">
          공유된 이미지에는 닉네임과 성향 프로필이 포함됩니다
        </p>
      </div>
    </div>
  )
}

// =============================================================================
// Main Page Component
// =============================================================================

export default function SharePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" />
            <p className="text-muted-foreground">로딩 중...</p>
          </div>
        </div>
      }
    >
      <SharePageContent />
    </Suspense>
  )
}
