'use client'

import { cn } from '@/lib/utils'

interface OnboardingSlideProps {
  title: string
  description: string
  illustration: React.ReactNode
  isActive?: boolean
  className?: string
}

/**
 * 온보딩 개별 슬라이드 컴포넌트
 * 픽셀 아트 스타일의 일러스트와 함께 서비스 소개
 */
export function OnboardingSlide({
  title,
  description,
  illustration,
  isActive = true,
  className,
}: OnboardingSlideProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 transition-opacity duration-300',
        isActive ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      {/* 일러스트레이션 영역 */}
      <div className="mb-8 flex h-48 w-48 items-center justify-center md:h-64 md:w-64">
        {illustration}
      </div>

      {/* 텍스트 영역 */}
      <div className="space-y-3 text-center">
        <h2 className="font-pixel text-pixel-heading text-foreground md:text-pixel-title">
          {title}
        </h2>
        <p className="text-body-md max-w-xs text-muted-foreground md:max-w-sm">
          {description}
        </p>
      </div>
    </div>
  )
}
