'use client'

import { cn } from '@/lib/utils'
import type { AcquiredObject, AxisScoreSummary } from '@/types/questions'

interface QuestionCompleteProps {
  axisScores: AxisScoreSummary[]
  acquiredObjects: AcquiredObject[]
  onGoToSpace: () => void
  onGoHome: () => void
}

export function QuestionComplete({
  axisScores,
  acquiredObjects,
  onGoToSpace,
  onGoHome,
}: QuestionCompleteProps) {
  const hasObjects = acquiredObjects.length > 0

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="inline-block px-4 py-2 bg-success text-white font-pixel text-pixel-caption border-4 border-pixel-black shadow-pixel mb-4">
            COMPLETE!
          </div>
          <h1 className="font-pixel text-pixel-title text-foreground">
            오늘의 결과
          </h1>
        </div>

        {/* Axis Score Changes */}
        {axisScores.length > 0 && (
          <div className="bg-pixel-white border-4 border-pixel-black shadow-pixel p-6 space-y-4">
            <h2 className="font-pixel text-pixel-body text-foreground mb-4">
              오늘의 성향 변화
            </h2>

            {axisScores.map((axis) => (
              <AxisScoreBar key={axis.axisCode} axis={axis} />
            ))}
          </div>
        )}

        {/* Acquired Objects */}
        {hasObjects && (
          <div className="bg-pixel-white border-4 border-pixel-black shadow-pixel p-6">
            <h2 className="font-pixel text-pixel-body text-foreground mb-4">
              획득한 오브젝트
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {acquiredObjects.map((obj) => (
                <div
                  key={obj.id}
                  className="flex flex-col items-center p-4 bg-gray-50 border-2 border-gray-200"
                >
                  <div className="w-16 h-16 bg-gray-100 border-2 border-pixel-black mb-2 flex items-center justify-center overflow-hidden">
                    {obj.thumbnailUrl || obj.imageUrl ? (
                      <img
                        src={obj.thumbnailUrl || obj.imageUrl}
                        alt={obj.name}
                        className="w-full h-full object-contain"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary-300" />
                    )}
                  </div>
                  <span className="font-sans text-sm text-center text-foreground">
                    {obj.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Objects - Progress to Next */}
        {!hasObjects && (
          <div className="bg-pixel-white border-4 border-pixel-black shadow-pixel p-6 text-center">
            <p className="font-sans text-muted-foreground mb-4">
              아직 새로운 오브젝트는 없어요
            </p>
            <div className="w-full h-3 bg-gray-200 border-2 border-pixel-black mb-2">
              <div className="h-full bg-primary-500 w-2/3" />
            </div>
            <p className="font-pixel text-pixel-caption text-primary-600">
              다음 오브젝트까지 조금만 더!
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {hasObjects && (
            <button
              onClick={onGoToSpace}
              className={cn(
                'w-full py-4',
                'bg-primary-500 text-white',
                'font-pixel text-pixel-body',
                'border-4 border-pixel-black shadow-pixel',
                'transition-all duration-fast',
                'hover:bg-primary-600',
                'active:translate-x-0.5 active:translate-y-0.5 active:shadow-pixel-pressed',
              )}
            >
              공간에 배치하기
            </button>
          )}

          <button
            onClick={onGoHome}
            className={cn(
              'w-full py-3',
              'bg-white text-foreground',
              'font-sans text-base',
              'border-2 border-gray-300',
              'transition-colors duration-fast',
              'hover:bg-gray-50',
            )}
          >
            {hasObjects ? '나중에 배치할게요' : '확인'}
          </button>
        </div>
      </div>
    </div>
  )
}

interface AxisScoreBarProps {
  axis: AxisScoreSummary
}

function AxisScoreBar({ axis }: AxisScoreBarProps) {
  const score = axis.averageScore ?? 50
  const normalizedScore = Math.max(0, Math.min(100, (score / 5) * 100))

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{axis.lowEndName}</span>
        <span className="font-medium text-foreground">{axis.axisName}</span>
        <span className="text-muted-foreground">{axis.highEndName}</span>
      </div>

      <div className="relative h-4 bg-gray-200 border-2 border-pixel-black">
        {/* Center marker */}
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-400" />

        {/* Score indicator */}
        <div
          className="absolute top-0 bottom-0 w-3 bg-primary-500 border border-pixel-black -ml-1.5 transition-all duration-500"
          style={{ left: `${normalizedScore}%` }}
        />
      </div>
    </div>
  )
}
