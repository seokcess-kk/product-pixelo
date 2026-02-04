'use client'

import { cn } from '@/lib/utils'

interface LoadingQuestionProps {
  message?: string
}

export function LoadingQuestion({ message = '질문을 불러오는 중...' }: LoadingQuestionProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      {/* Pixel Loading Animation */}
      <div className="relative w-32 h-32 mb-8">
        {/* Character thinking animation */}
        <div className="absolute inset-0 bg-primary-100 border-4 border-pixel-black shadow-pixel flex items-center justify-center">
          <div className="w-16 h-16 bg-primary-500 animate-pulse pixel-render">
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

        {/* Thinking dots */}
        <div className="absolute -top-4 -right-4 flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                'bg-pixel-black animate-[thinking-dot_1s_ease-in-out_infinite]',
                i === 2 ? 'w-2 h-2' : 'w-3 h-3',
              )}
              style={{
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Loading Text */}
      <p className="font-pixel text-pixel-body text-muted-foreground mb-4">
        {message}
      </p>

      {/* Pixel Loading Bar */}
      <div className="w-48 h-4 bg-gray-200 border-2 border-pixel-black overflow-hidden">
        <div
          className="h-full bg-primary-500 animate-[pixel-loading_1.5s_steps(10)_infinite]"
        />
      </div>
    </div>
  )
}
