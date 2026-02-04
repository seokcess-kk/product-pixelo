'use client'

import { cn } from '@/lib/utils'

// =============================================================================
// Types
// =============================================================================

interface SeasonInfo {
  seasonNumber: number
  name: string
  isActive: boolean
}

interface SeasonSelectorProps {
  currentSeason: number
  seasons?: SeasonInfo[]
  onSeasonChange: (season: number) => void
  className?: string
}

// =============================================================================
// Main Component
// =============================================================================

export function SeasonSelector({
  currentSeason,
  seasons = [{ seasonNumber: 1, name: '시즌 1: 나의 방', isActive: true }],
  onSeasonChange,
  className,
}: SeasonSelectorProps) {
  // 현재 시즌만 있는 경우 표시하지 않음
  if (seasons.length <= 1) {
    return null
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-sm text-muted-foreground">시즌</span>
      <div className="flex gap-1 rounded-lg border bg-muted/50 p-1">
        {seasons.map((season) => (
          <button
            key={season.seasonNumber}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              currentSeason === season.seasonNumber
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => onSeasonChange(season.seasonNumber)}
            disabled={!season.isActive}
          >
            {season.seasonNumber}
          </button>
        ))}
      </div>
    </div>
  )
}
