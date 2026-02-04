'use client'

import { cn } from '@/lib/utils'

interface ErrorQuestionProps {
  message?: string
  onRetry: () => void
  onGoHome: () => void
}

export function ErrorQuestion({
  message = '질문을 불러오는 중 문제가 발생했어요',
  onRetry,
  onGoHome,
}: ErrorQuestionProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      {/* Error Icon */}
      <div className="w-24 h-24 mb-8 bg-error-light border-4 border-error shadow-pixel flex items-center justify-center">
        <svg
          className="w-12 h-12 text-error"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="square"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>

      {/* Error Message */}
      <h1 className="font-pixel text-pixel-heading text-foreground mb-4">
        앗, 문제가 생겼어요
      </h1>

      <p className="font-sans text-muted-foreground mb-8 max-w-xs">
        {message}
      </p>

      {/* Actions */}
      <div className="space-y-3 w-full max-w-xs">
        <button
          onClick={onRetry}
          className={cn(
            'w-full py-3',
            'bg-primary-500 text-white',
            'font-pixel text-pixel-body',
            'border-4 border-pixel-black shadow-pixel',
            'transition-all duration-fast',
            'hover:bg-primary-600',
            'active:translate-x-0.5 active:translate-y-0.5 active:shadow-pixel-pressed',
          )}
        >
          다시 시도
        </button>

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
          홈으로
        </button>
      </div>
    </div>
  )
}
