'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { OnboardingSlide } from './OnboardingSlide'
import { OnboardingIndicator } from './OnboardingIndicator'
import { PixelButton } from './PixelButton'
import {
  PixelLogo,
  QuestionIllustration,
  ObjectIllustration,
  SpaceIllustration,
} from './PixelIllustrations'

interface OnboardingStep {
  id: string
  title: string
  description: string
  illustration: React.ReactNode
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'PIXELO',
    description: '매일 질문에 답하며, 나만의 픽셀 공간을 완성해보세요.',
    illustration: <PixelLogo className="h-full w-full" />,
  },
  {
    id: 'question',
    title: '질문에 답해요',
    description: '하루 3~5개의 질문에 답하면 나를 더 잘 알게 됩니다. 1분이면 충분해요!',
    illustration: <QuestionIllustration className="h-full w-full" />,
  },
  {
    id: 'object',
    title: '오브젝트를 모아요',
    description: '응답 결과에 따라 나를 표현하는 픽셀 오브젝트를 획득해요.',
    illustration: <ObjectIllustration className="h-full w-full" />,
  },
  {
    id: 'space',
    title: '공간을 꾸며요',
    description: '모은 오브젝트로 나만의 감성 공간을 완성하고 친구들과 공유해보세요!',
    illustration: <SpaceIllustration className="h-full w-full" />,
  },
]

interface OnboardingCarouselProps {
  onComplete?: () => void
  className?: string
}

/**
 * 온보딩 캐러셀 컴포넌트
 * 스와이프와 버튼으로 슬라이드 전환 가능
 */
export function OnboardingCarousel({
  onComplete,
  className,
}: OnboardingCarouselProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)
  const router = useRouter()

  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1

  const goToStep = useCallback((stepIndex: number, dir: 'left' | 'right') => {
    if (isAnimating) return
    setIsAnimating(true)
    setDirection(dir)
    setCurrentStep(stepIndex)
    setTimeout(() => setIsAnimating(false), 300)
  }, [isAnimating])

  const handleNext = useCallback(() => {
    if (isLastStep) {
      onComplete?.()
      router.push('/login')
    } else {
      goToStep(currentStep + 1, 'right')
    }
  }, [currentStep, isLastStep, goToStep, onComplete, router])

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      goToStep(currentStep - 1, 'left')
    }
  }, [currentStep, goToStep])

  const handleSkip = useCallback(() => {
    router.push('/login')
  }, [router])

  // 터치 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    const threshold = 50

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentStep < ONBOARDING_STEPS.length - 1) {
        // 왼쪽으로 스와이프 -> 다음
        handleNext()
      } else if (diff < 0 && currentStep > 0) {
        // 오른쪽으로 스와이프 -> 이전
        handlePrev()
      }
    }
  }

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        handlePrev()
      } else if (e.key === 'Escape') {
        handleSkip()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev, handleSkip])

  const currentSlide = ONBOARDING_STEPS[currentStep]

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex min-h-screen flex-col bg-gradient-to-b from-background to-primary-50/30',
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 헤더 - 건너뛰기 버튼 */}
      <header className="flex justify-end p-4">
        {!isLastStep && (
          <button
            onClick={handleSkip}
            className="font-pixel text-pixel-caption text-muted-foreground transition-colors hover:text-foreground"
          >
            건너뛰기
          </button>
        )}
      </header>

      {/* 슬라이드 영역 */}
      <main className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="relative w-full max-w-md">
          <div
            className={cn(
              'transition-all duration-300',
              isAnimating && direction === 'right' && 'animate-slide-left',
              isAnimating && direction === 'left' && 'animate-slide-right'
            )}
          >
            <OnboardingSlide
              key={currentSlide.id}
              title={currentSlide.title}
              description={currentSlide.description}
              illustration={currentSlide.illustration}
            />
          </div>
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <footer className="space-y-6 p-6 pb-8">
        {/* 인디케이터 */}
        <OnboardingIndicator
          total={ONBOARDING_STEPS.length}
          current={currentStep}
        />

        {/* 버튼 영역 */}
        <div className="flex flex-col gap-3">
          <PixelButton
            variant="primary"
            size="lg"
            onClick={handleNext}
            className="w-full"
          >
            {isLastStep ? '시작하기' : '다음'}
          </PixelButton>

          {currentStep > 0 && !isLastStep && (
            <PixelButton
              variant="ghost"
              size="md"
              onClick={handlePrev}
              className="w-full"
            >
              이전
            </PixelButton>
          )}
        </div>
      </footer>
    </div>
  )
}
