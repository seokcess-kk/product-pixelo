'use client'

import { cn } from '@/lib/utils'

interface OnboardingIndicatorProps {
  total: number
  current: number
  className?: string
}

/**
 * 온보딩 진행 상태 인디케이터
 * 픽셀 스타일의 도트로 현재 위치 표시
 */
export function OnboardingIndicator({
  total,
  current,
  className,
}: OnboardingIndicatorProps) {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'h-2 w-2 transition-all duration-200',
            index === current
              ? 'w-6 bg-primary-500'
              : 'bg-muted-foreground/30',
            // 픽셀 스타일 - 정사각형
            'rounded-none'
          )}
          aria-label={index === current ? `현재 페이지: ${index + 1}` : `페이지 ${index + 1}`}
          aria-current={index === current ? 'step' : undefined}
        />
      ))}
    </div>
  )
}
