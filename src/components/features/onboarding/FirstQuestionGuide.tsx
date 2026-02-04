'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { PixelButton } from './PixelButton'
import { QuestionIllustration, StartIllustration } from './PixelIllustrations'

interface FirstQuestionGuideProps {
  userName?: string
  onStart?: () => void
  className?: string
}

/**
 * 첫 질문 시작 전 안내 화면
 * 새로운 사용자에게 질문 응답 방법을 안내합니다.
 */
export function FirstQuestionGuide({
  userName = '픽셀러',
  onStart,
  className,
}: FirstQuestionGuideProps) {
  const [step, setStep] = useState(0)
  const router = useRouter()

  const guides = [
    {
      id: 'welcome',
      title: `${userName}님, 반가워요!`,
      description: '지금부터 나를 알아가는 질문이 시작됩니다. 편하게 답해주세요.',
      illustration: <QuestionIllustration className="h-full w-full" />,
    },
    {
      id: 'howto',
      title: '이렇게 답해요',
      description: '마음에 드는 답변을 선택하면 자동으로 다음 질문으로 넘어갑니다. 하루에 3~5개, 1분이면 끝!',
      illustration: <StartIllustration className="h-full w-full" />,
    },
  ]

  const isLastStep = step === guides.length - 1
  const currentGuide = guides[step]

  const handleNext = () => {
    if (isLastStep) {
      onStart?.()
      // 질문 페이지로 이동
    } else {
      setStep(step + 1)
    }
  }

  const handleSkip = () => {
    onStart?.()
  }

  return (
    <div
      className={cn(
        'flex min-h-screen flex-col bg-gradient-to-b from-background to-primary-50/30',
        className
      )}
    >
      {/* 헤더 */}
      <header className="flex justify-end p-4">
        <button
          onClick={handleSkip}
          className="font-pixel text-pixel-caption text-muted-foreground transition-colors hover:text-foreground"
        >
          바로 시작
        </button>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex flex-1 flex-col items-center justify-center px-6">
        {/* 일러스트레이션 */}
        <div className="mb-8 h-40 w-40 animate-float md:h-48 md:w-48">
          {currentGuide.illustration}
        </div>

        {/* 텍스트 */}
        <div className="max-w-sm space-y-3 text-center">
          <h2 className="font-pixel text-pixel-heading text-foreground md:text-pixel-title">
            {currentGuide.title}
          </h2>
          <p className="text-body-md leading-relaxed text-muted-foreground">
            {currentGuide.description}
          </p>
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <footer className="space-y-4 p-6 pb-8">
        {/* 인디케이터 */}
        <div className="flex items-center justify-center gap-2">
          {guides.map((_, index) => (
            <div
              key={index}
              className={cn(
                'h-2 w-2 transition-all duration-200',
                index === step ? 'w-6 bg-primary-500' : 'bg-muted-foreground/30'
              )}
            />
          ))}
        </div>

        {/* 버튼 */}
        <PixelButton
          variant="primary"
          size="lg"
          onClick={handleNext}
          className="w-full"
        >
          {isLastStep ? '질문 시작하기' : '다음'}
        </PixelButton>
      </footer>
    </div>
  )
}

/**
 * 질문 시작 전 팁 박스
 */
interface TipBoxProps {
  tips: string[]
  className?: string
}

export function QuestionTipBox({ tips, className }: TipBoxProps) {
  return (
    <div
      className={cn(
        'border-2 border-pixel-black bg-pixel-white p-4 shadow-pixel',
        className
      )}
    >
      <h3 className="mb-3 font-pixel text-pixel-body text-foreground">
        TIP
      </h3>
      <ul className="space-y-2">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start gap-2 text-body-sm text-muted-foreground">
            <span className="text-pixel-gold">*</span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * 질문 완료 축하 메시지 컴포넌트
 */
interface QuestionCompleteProps {
  objectName?: string
  objectImage?: React.ReactNode
  onContinue?: () => void
  className?: string
}

export function QuestionComplete({
  objectName = '신비로운 오브젝트',
  objectImage,
  onContinue,
  className,
}: QuestionCompleteProps) {
  return (
    <div
      className={cn(
        'flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-primary-50/30 p-6',
        className
      )}
    >
      {/* 별 효과 배경 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 h-2 w-2 animate-pixel-blink bg-pixel-gold" />
        <div className="absolute top-32 right-16 h-3 w-3 animate-pixel-blink bg-pixel-star" style={{ animationDelay: '0.3s' }} />
        <div className="absolute bottom-40 left-20 h-2 w-2 animate-pixel-blink bg-pixel-gold" style={{ animationDelay: '0.6s' }} />
        <div className="absolute bottom-32 right-10 h-2 w-2 animate-pixel-blink bg-pixel-star" style={{ animationDelay: '0.9s' }} />
      </div>

      <div className="relative z-10 max-w-sm space-y-8 text-center">
        {/* 축하 메시지 */}
        <div className="space-y-2">
          <p className="font-pixel text-pixel-body text-pixel-gold">
            COMPLETE!
          </p>
          <h2 className="font-pixel text-pixel-title text-foreground">
            오늘의 질문 완료!
          </h2>
        </div>

        {/* 획득한 오브젝트 */}
        <div className="space-y-4">
          <div className="mx-auto flex h-32 w-32 items-center justify-center border-4 border-pixel-black bg-primary-100 shadow-pixel">
            {objectImage || (
              <div className="h-20 w-20 animate-pixel-bounce bg-pixel-gold" />
            )}
          </div>
          <div className="space-y-1">
            <p className="text-body-sm text-muted-foreground">새로운 오브젝트 획득!</p>
            <p className="font-pixel text-pixel-subhead text-foreground">
              {objectName}
            </p>
          </div>
        </div>

        {/* 버튼 */}
        <PixelButton
          variant="primary"
          size="lg"
          onClick={onContinue}
          className="w-full"
        >
          내 공간에서 확인하기
        </PixelButton>
      </div>
    </div>
  )
}
