'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'kakao' | 'naver'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

/**
 * 픽셀 아트 스타일 버튼
 * 3D 눌림 효과와 픽셀 보더 적용
 */
const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // 기본 스타일
          'relative inline-flex items-center justify-center font-pixel transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',

          // 픽셀 3D 효과 (눌리지 않은 상태)
          'before:absolute before:inset-0',

          // Variants
          {
            // Primary - 메인 액션 버튼
            'bg-primary-500 text-white': variant === 'primary',
            // Primary pixel border effect
            'shadow-[inset_-4px_-4px_0_#2E41B8,inset_4px_4px_0_#9BB5FF]': variant === 'primary' && !isDisabled,
            'active:shadow-[inset_4px_4px_0_#2E41B8,inset_-4px_-4px_0_#9BB5FF] active:translate-x-0.5 active:translate-y-0.5': variant === 'primary' && !isDisabled,

            // Secondary
            'bg-white text-foreground border-2 border-pixel-black': variant === 'secondary',
            'shadow-pixel': variant === 'secondary' && !isDisabled,
            'active:shadow-pixel-pressed active:translate-x-0.5 active:translate-y-0.5': variant === 'secondary' && !isDisabled,

            // Ghost
            'bg-transparent text-primary-500 hover:bg-primary-50': variant === 'ghost',

            // Kakao
            'bg-kakao text-[#191919]': variant === 'kakao',
            'shadow-[inset_-4px_-4px_0_#D4C200,inset_4px_4px_0_#FFF066]': variant === 'kakao' && !isDisabled,
            'active:shadow-[inset_4px_4px_0_#D4C200,inset_-4px_-4px_0_#FFF066] active:translate-x-0.5 active:translate-y-0.5': variant === 'kakao' && !isDisabled,

            // Naver
            'bg-naver text-white': variant === 'naver',
            'shadow-[inset_-4px_-4px_0_#029E47,inset_4px_4px_0_#4AE080]': variant === 'naver' && !isDisabled,
            'active:shadow-[inset_4px_4px_0_#029E47,inset_-4px_-4px_0_#4AE080] active:translate-x-0.5 active:translate-y-0.5': variant === 'naver' && !isDisabled,
          },

          // Sizes
          {
            'h-8 px-4 text-pixel-caption': size === 'sm',
            'h-12 px-6 text-pixel-body': size === 'md',
            'h-14 px-8 text-pixel-subhead': size === 'lg',
          },

          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 animate-pixel-blink bg-current" />
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)

PixelButton.displayName = 'PixelButton'

export { PixelButton }
