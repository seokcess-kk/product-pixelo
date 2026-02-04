'use client'

import { cn } from '@/lib/utils'
import type { TodayQuestion } from '@/types/questions'

interface QuestionCardProps {
  question: TodayQuestion
  currentIndex: number
  totalCount: number
  className?: string
}

export function QuestionCard({
  question,
  currentIndex,
  totalCount,
  className,
}: QuestionCardProps) {
  const progressPercentage = Math.round(((currentIndex) / totalCount) * 100)

  return (
    <div
      className={cn(
        'relative w-full max-w-md mx-auto',
        'bg-pixel-white border-4 border-pixel-black shadow-pixel',
        'p-6 space-y-6',
        className
      )}
    >
      {/* Header: Progress */}
      <div className="flex items-center justify-between">
        <span className="font-pixel text-pixel-caption text-muted-foreground">
          오늘의 질문
        </span>
        <span className="font-pixel text-pixel-caption text-primary-600">
          {currentIndex + 1} / {totalCount}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-gray-200 border-2 border-pixel-black">
        <div
          className="h-full bg-primary-500 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Question Text */}
      <div className="py-8">
        <h2 className="font-pixel text-pixel-heading text-center text-foreground leading-relaxed">
          {question.questionText}
        </h2>
      </div>

      {/* Day Number Badge */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <span className="inline-block px-4 py-1 bg-primary-500 text-white font-pixel text-pixel-caption border-2 border-pixel-black">
          Day {question.dayNumber}
        </span>
      </div>
    </div>
  )
}
