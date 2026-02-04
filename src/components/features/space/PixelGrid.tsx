'use client'

import { cn } from '@/lib/utils'
import type { Pixel } from '@/types'

interface PixelGridProps {
  pixels: Pixel[]
  gridSize: number
  onPixelClick?: (pixel: Pixel) => void
  className?: string
}

export function PixelGrid({
  pixels,
  gridSize,
  onPixelClick,
  className,
}: PixelGridProps) {
  // 픽셀 맵 생성 (좌표 -> 픽셀)
  const pixelMap = new Map<string, Pixel>()
  pixels.forEach((pixel) => {
    pixelMap.set(`${pixel.x}-${pixel.y}`, pixel)
  })

  return (
    <div
      className={cn(
        'grid aspect-square w-full gap-0.5 rounded-lg border bg-muted/30 p-2',
        className
      )}
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
      }}
    >
      {Array.from({ length: gridSize * gridSize }).map((_, index) => {
        const x = index % gridSize
        const y = Math.floor(index / gridSize)
        const pixel = pixelMap.get(`${x}-${y}`)

        return (
          <button
            key={index}
            className={cn(
              'aspect-square rounded-sm transition-transform hover:scale-105',
              pixel ? '' : 'bg-muted/50'
            )}
            style={{
              backgroundColor: pixel?.colorCode || undefined,
            }}
            onClick={() => pixel && onPixelClick?.(pixel)}
            disabled={!pixel}
            aria-label={pixel ? `픽셀 (${x}, ${y})` : '빈 픽셀'}
          />
        )
      })}
    </div>
  )
}
