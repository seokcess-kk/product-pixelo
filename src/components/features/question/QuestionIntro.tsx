'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface QuestionIntroProps {
  questionCount: number
  streakDays?: number
  onStart: () => void
  isLoading?: boolean
}

export function QuestionIntro({
  questionCount,
  streakDays,
  onStart,
  isLoading = false,
}: QuestionIntroProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      {/* Pixel Character Illustration */}
      <div className="w-32 h-32 mb-8 bg-primary-100 border-4 border-pixel-black shadow-pixel flex items-center justify-center animate-float">
        <div className="w-16 h-16 bg-primary-500" style={{ imageRendering: 'pixelated' }}>
          {/* Placeholder for pixel character */}
          <svg viewBox="0 0 16 16" className="w-full h-full">
            <rect x="6" y="2" width="4" height="4" fill="white" />
            <rect x="5" y="6" width="6" height="6" fill="white" />
            <rect x="4" y="8" width="2" height="4" fill="white" />
            <rect x="10" y="8" width="2" height="4" fill="white" />
            <rect x="6" y="12" width="2" height="2" fill="white" />
            <rect x="8" y="12" width="2" height="2" fill="white" />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h1 className="font-pixel text-pixel-title text-foreground mb-4">
        오늘의 질문
      </h1>

      {/* Description */}
      <p className="font-pixel text-pixel-body text-muted-foreground mb-2">
        {questionCount}개가 준비되었어요
      </p>
      <p className="font-sans text-sm text-muted-foreground mb-8">
        예상 소요시간: {Math.ceil(questionCount * 0.5)}분
      </p>

      {/* Start Button */}
      <PixelButton onClick={onStart} disabled={isLoading}>
        {isLoading ? '로딩 중...' : '시작하기'}
      </PixelButton>

      {/* Streak Days */}
      {streakDays !== undefined && streakDays > 0 && (
        <div className="mt-8 flex items-center gap-2 text-muted-foreground">
          <span className="text-pixel-star text-lg">*</span>
          <span className="font-sans text-sm">연속 {streakDays}일째 응답 중</span>
          <span className="text-pixel-star text-lg">*</span>
        </div>
      )}
    </div>
  )
}

interface PixelButtonProps {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  className?: string
}

function PixelButton({ children, onClick, disabled, className }: PixelButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'px-8 py-4',
        'bg-primary-500 text-white',
        'font-pixel text-pixel-body',
        'border-4 border-pixel-black',
        'shadow-pixel',
        'transition-all duration-fast',
        'hover:bg-primary-600',
        'active:translate-x-0.5 active:translate-y-0.5 active:shadow-pixel-pressed',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2',
        className,
      )}
    >
      {children}
    </button>
  )
}
