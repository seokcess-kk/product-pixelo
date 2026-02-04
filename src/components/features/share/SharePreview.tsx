'use client'

import { forwardRef, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { AXIS_METADATA, scoreToPercentage } from '@/lib/score-calculator'
import type { AxisCode, AxisScoreData } from '@/lib/score-calculator'
import type { PlacedObject } from '@/components/features/space/SpaceGrid'
import { AXIS_COLORS, ShareCardSize, SHARE_CARD_DIMENSIONS } from '@/types/share'

// =============================================================================
// Types
// =============================================================================

interface SharePreviewProps {
  nickname: string
  avatarUrl?: string
  seasonName: string
  seasonNumber?: number
  placedObjects: PlacedObject[]
  axisScores: AxisScoreData[]
  gridSize?: number
  backgroundUrl?: string
  size?: ShareCardSize
  className?: string
}

// =============================================================================
// Sub Components
// =============================================================================

interface AxisScoreBarProps {
  axisCode: AxisCode
  score: number
  compact?: boolean
}

function AxisScoreBar({ axisCode, score, compact = false }: AxisScoreBarProps) {
  const metadata = AXIS_METADATA[axisCode]
  const colors = AXIS_COLORS[axisCode] ?? { main: '#888888', light: '#EEEEEE', dark: '#666666' }
  const percentage = scoreToPercentage(score)

  return (
    <div className={cn('flex items-center gap-2', compact ? 'gap-1' : 'gap-2')}>
      <span
        className={cn(
          'text-right font-medium text-pixel-black',
          compact ? 'w-10 text-[10px]' : 'w-14 text-xs'
        )}
      >
        {metadata.lowEndName}
      </span>
      <div
        className={cn(
          'relative flex-1 overflow-hidden rounded-full',
          compact ? 'h-2' : 'h-3'
        )}
        style={{ backgroundColor: colors.light }}
      >
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: colors.main,
          }}
        />
        {/* 점수 마커 */}
        <div
          className={cn(
            'absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white',
            compact ? 'h-3 w-3' : 'h-4 w-4'
          )}
          style={{
            left: `${percentage}%`,
            backgroundColor: colors.dark,
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        />
      </div>
      <span
        className={cn(
          'font-medium text-pixel-black',
          compact ? 'w-10 text-[10px]' : 'w-14 text-xs'
        )}
      >
        {metadata.highEndName}
      </span>
    </div>
  )
}

interface MiniSpaceGridProps {
  placedObjects: PlacedObject[]
  gridSize: number
  size: number
  backgroundUrl?: string
}

function MiniSpaceGrid({ placedObjects, gridSize, size, backgroundUrl }: MiniSpaceGridProps) {
  const cellSize = size / gridSize

  return (
    <div
      className="relative overflow-hidden rounded-lg border-2 border-pixel-black/20"
      style={{
        width: size,
        height: size,
        backgroundColor: '#F5F5F5',
      }}
    >
      {/* 배경 이미지 */}
      {backgroundUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
        />
      )}

      {/* 그리드 라인 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: `${cellSize}px ${cellSize}px`,
        }}
      />

      {/* 배치된 오브젝트들 */}
      {placedObjects.map((placedObject) => {
        const { object, x, y, scale, rotation, zIndex } = placedObject
        const width = (object.width ?? 1) * cellSize
        const height = (object.height ?? 1) * cellSize

        return (
          <div
            key={placedObject.objectId}
            className="absolute"
            style={{
              left: x * cellSize,
              top: y * cellSize,
              width: width * scale,
              height: height * scale,
              transform: `rotate(${rotation}deg)`,
              zIndex: zIndex + 10,
            }}
          >
            {object.imageUrl ? (
              <img
                src={object.imageUrl}
                alt={object.name}
                className="h-full w-full object-contain"
                style={{ imageRendering: 'pixelated' }}
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center rounded-sm bg-gradient-to-br from-primary/20 to-primary/40 text-[8px] font-medium text-primary"
                style={{ imageRendering: 'pixelated' }}
              >
                {object.name.slice(0, 2)}
              </div>
            )}
          </div>
        )
      })}

      {/* 빈 공간 안내 */}
      {placedObjects.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="text-xs">아직 배치된</p>
            <p className="text-xs">오브젝트가 없어요</p>
          </div>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * 공유 카드 미리보기 컴포넌트
 * html-to-image로 캡처될 수 있도록 순수 CSS로 구성
 */
export const SharePreview = forwardRef<HTMLDivElement, SharePreviewProps>(
  function SharePreview(
    {
      nickname,
      avatarUrl,
      seasonName,
      seasonNumber,
      placedObjects,
      axisScores,
      gridSize = 10,
      backgroundUrl,
      size = ShareCardSize.SQUARE,
      className,
    },
    ref
  ) {
    const dimensions = SHARE_CARD_DIMENSIONS[size]
    const isStory = size === ShareCardSize.STORY
    const isOG = size === ShareCardSize.OG

    // 축 점수를 정렬 (7개 측정축)
    const sortedScores = useMemo(() => {
      return [...axisScores].sort((a, b) => {
        const order = ['energy', 'lifestyle', 'emotion', 'aesthetic', 'social', 'challenge', 'relationship']
        return order.indexOf(a.axisCode) - order.indexOf(b.axisCode)
      })
    }, [axisScores])

    // 스케일 비율 계산 (미리보기용, 실제 내보내기는 원본 크기)
    const scale = isStory ? 0.25 : isOG ? 0.35 : 0.4
    const previewWidth = dimensions.width * scale
    const previewHeight = dimensions.height * scale

    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden',
          'bg-gradient-to-br from-primary-50 to-white',
          'shadow-pixel',
          className
        )}
        style={{
          width: previewWidth,
          height: previewHeight,
          // 내부 요소들의 스케일을 위한 기준
          fontSize: `${12 * scale}px`,
        }}
      >
        {/* 배경 패턴 (픽셀 도트) */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle, #4D6FFF 1px, transparent 1px)`,
            backgroundSize: `${16 * scale}px ${16 * scale}px`,
          }}
        />

        {/* 컨텐츠 컨테이너 */}
        <div
          className={cn(
            'relative flex h-full w-full flex-col',
            isStory ? 'gap-4 p-6' : isOG ? 'flex-row gap-4 p-5' : 'gap-3 p-5'
          )}
          style={{
            gap: `${(isStory ? 24 : isOG ? 20 : 16) * scale}px`,
            padding: `${(isStory ? 32 : 24) * scale}px`,
          }}
        >
          {/* 헤더: 사용자 정보 */}
          <div
            className={cn(
              'flex items-center',
              isOG ? 'flex-col items-start gap-2' : 'justify-between'
            )}
            style={{ gap: `${8 * scale}px` }}
          >
            <div className="flex items-center" style={{ gap: `${8 * scale}px` }}>
              {/* 아바타 */}
              <div
                className="overflow-hidden rounded-lg border-2 border-primary-200 bg-primary-100"
                style={{
                  width: `${(isStory ? 56 : 44) * scale}px`,
                  height: `${(isStory ? 56 : 44) * scale}px`,
                }}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={nickname}
                    className="h-full w-full object-cover"
                    style={{ imageRendering: 'pixelated' }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-primary-500">
                    <span style={{ fontSize: `${(isStory ? 24 : 18) * scale}px` }}>
                      {nickname.slice(0, 1)}
                    </span>
                  </div>
                )}
              </div>

              {/* 닉네임 & 시즌 */}
              <div>
                <p
                  className="font-bold text-pixel-black"
                  style={{ fontSize: `${(isStory ? 20 : 16) * scale}px` }}
                >
                  {nickname}
                </p>
                <p
                  className="text-muted-foreground"
                  style={{ fontSize: `${(isStory ? 14 : 12) * scale}px` }}
                >
                  {seasonNumber ? `Season ${seasonNumber}` : ''} {seasonName}
                </p>
              </div>
            </div>

            {/* PIXELO 로고 (스토리, 정사각형) */}
            {!isOG && (
              <div
                className="font-pixel text-primary-500"
                style={{ fontSize: `${(isStory ? 18 : 14) * scale}px` }}
              >
                PIXELO
              </div>
            )}
          </div>

          {/* 메인 컨텐츠 */}
          <div
            className={cn(
              'flex flex-1',
              isOG ? 'flex-row items-center gap-6' : 'flex-col gap-4'
            )}
            style={{ gap: `${(isOG ? 32 : isStory ? 20 : 16) * scale}px` }}
          >
            {/* 공간 미리보기 */}
            <div className={cn('flex justify-center', isOG ? 'flex-shrink-0' : '')}>
              <MiniSpaceGrid
                placedObjects={placedObjects}
                gridSize={gridSize}
                size={(isStory ? 320 : isOG ? 200 : 200) * scale}
                backgroundUrl={backgroundUrl}
              />
            </div>

            {/* 7개 축 점수 */}
            <div
              className={cn('flex flex-1 flex-col justify-center', isOG ? 'pr-4' : '')}
              style={{ gap: `${(isStory ? 12 : 8) * scale}px` }}
            >
              <p
                className="mb-1 font-medium text-pixel-black"
                style={{
                  fontSize: `${(isStory ? 14 : 12) * scale}px`,
                  marginBottom: `${4 * scale}px`,
                }}
              >
                나의 성향 프로필
              </p>
              {sortedScores.map((scoreData) => (
                <AxisScoreBar
                  key={scoreData.axisCode}
                  axisCode={scoreData.axisCode}
                  score={scoreData.averageScore}
                  compact={isOG || size === ShareCardSize.SQUARE}
                />
              ))}

              {/* 축 점수가 없는 경우 */}
              {sortedScores.length === 0 && (
                <div
                  className="text-center text-muted-foreground"
                  style={{ fontSize: `${12 * scale}px` }}
                >
                  아직 측정된 성향이 없어요
                </div>
              )}
            </div>
          </div>

          {/* 푸터 */}
          <div
            className={cn(
              'flex items-center justify-between border-t border-primary-100 pt-3',
              isOG && 'hidden'
            )}
            style={{
              paddingTop: `${12 * scale}px`,
              borderTopWidth: `${1 * scale}px`,
            }}
          >
            <p
              className="text-muted-foreground"
              style={{ fontSize: `${10 * scale}px` }}
            >
              pixelo.app에서 나만의 공간 만들기
            </p>
            <div
              className="font-pixel text-primary-400"
              style={{ fontSize: `${10 * scale}px` }}
            >
              PIXELO
            </div>
          </div>

          {/* OG용 로고 (우측 하단) */}
          {isOG && (
            <div
              className="absolute bottom-4 right-4 font-pixel text-primary-500"
              style={{
                fontSize: `${16 * scale}px`,
                bottom: `${16 * scale}px`,
                right: `${16 * scale}px`,
              }}
            >
              PIXELO
            </div>
          )}
        </div>
      </div>
    )
  }
)

SharePreview.displayName = 'SharePreview'
