'use client'

import { cn } from '@/lib/utils'

interface QuestionProgressProps {
  currentDay: number
  totalDays: number
  className?: string
}

export function QuestionProgress({
  currentDay,
  totalDays,
  className,
}: QuestionProgressProps) {
  const progressPercentage = totalDays > 0 ? Math.round((currentDay / totalDays) * 100) : 0
  const segments = Math.min(totalDays, 10) // Max 10 segments for visual clarity
  const segmentWidth = 100 / segments
  const filledSegments = Math.round((currentDay / totalDays) * segments)

  return (
    <div className={cn('w-full', className)}>
      {/* Label */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-pixel text-pixel-caption text-muted-foreground">
          시즌 진행률
        </span>
        <span className="font-pixel text-pixel-caption text-primary-600">
          {currentDay} / {totalDays}일
        </span>
      </div>

      {/* Pixel Progress Bar */}
      <div className="relative h-6 bg-gray-200 border-2 border-pixel-black">
        {/* Segments */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: segments }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-full border-r border-gray-300 last:border-r-0',
                'transition-colors duration-150',
                i < filledSegments ? 'bg-primary-500' : 'bg-transparent',
              )}
              style={{ width: `${segmentWidth}%` }}
            />
          ))}
        </div>

        {/* Percentage Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-pixel text-pixel-caption text-white drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)]">
            {progressPercentage}%
          </span>
        </div>
      </div>
    </div>
  )
}
