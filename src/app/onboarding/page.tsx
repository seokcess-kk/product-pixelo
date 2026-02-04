'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ONBOARDING_STEPS = [
  {
    title: '환영합니다!',
    description: 'PIXELO에서 나만의 감성 공간을 만들어보세요.',
  },
  {
    title: '매일 질문에 답해요',
    description: '하루에 하나씩, 나를 알아가는 질문에 답해보세요.',
  },
  {
    title: '픽셀이 쌓여요',
    description: '답변이 모여 나만의 픽셀 공간이 완성됩니다.',
  },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const router = useRouter()

  const handleNext = () => {
    if (step < ONBOARDING_STEPS.length - 1) {
      setStep(step + 1)
    } else {
      router.push('/question')
    }
  }

  const handleSkip = () => {
    router.push('/question')
  }

  const currentStep = ONBOARDING_STEPS[step]

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Progress indicator */}
        <div className="flex justify-center gap-2">
          {ONBOARDING_STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{currentStep.title}</h1>
          <p className="text-muted-foreground">{currentStep.description}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleNext}
            className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {step < ONBOARDING_STEPS.length - 1 ? '다음' : '시작하기'}
          </button>
          {step < ONBOARDING_STEPS.length - 1 && (
            <button
              onClick={handleSkip}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              건너뛰기
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
