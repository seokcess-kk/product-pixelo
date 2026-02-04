'use client'

import { cn } from '@/lib/utils'
import { QuestionProgress } from './QuestionProgress'

interface QuestionAlreadyCompleteProps {
  currentDay: number
  totalDays: number
  onGoHome: () => void
  onViewHistory?: () => void
}

export function QuestionAlreadyComplete({
  currentDay,
  totalDays,
  onGoHome,
  onViewHistory,
}: QuestionAlreadyCompleteProps) {
  const isSeasonComplete = currentDay >= totalDays

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      {/* Icon */}
      <div className="w-24 h-24 mb-8 bg-success/10 border-4 border-success shadow-pixel flex items-center justify-center">
        <svg
          className="w-12 h-12 text-success"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="square"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      {/* Message */}
      <h1 className="font-pixel text-pixel-title text-foreground mb-4">
        {isSeasonComplete ? '시즌 완료!' : '오늘의 질문 완료!'}
      </h1>

      <p className="font-sans text-muted-foreground mb-8 max-w-xs">
        {isSeasonComplete
          ? '이번 시즌의 모든 질문에 답변했어요. 새 시즌을 기대해주세요!'
          : '오늘의 질문은 모두 답변했어요. 내일 새 질문이 도착해요!'}
      </p>

      {/* Progress */}
      <div className="w-full max-w-sm mb-8">
        <QuestionProgress currentDay={currentDay} totalDays={totalDays} />
      </div>

      {/* Actions */}
      <div className="space-y-3 w-full max-w-xs">
        {onViewHistory && (
          <button
            onClick={onViewHistory}
            className={cn(
              'w-full py-3',
              'bg-white text-foreground',
              'font-sans text-base',
              'border-4 border-pixel-black shadow-pixel',
              'transition-all duration-fast',
              'hover:bg-gray-50',
              'active:translate-x-0.5 active:translate-y-0.5 active:shadow-pixel-pressed',
            )}
          >
            지난 결과 보기
          </button>
        )}

        <button
          onClick={onGoHome}
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
          홈으로
        </button>
      </div>
    </div>
  )
}
