'use client'

import { OnboardingCarousel } from '@/components/features/onboarding'

/**
 * 온보딩 페이지
 * 신규 사용자에게 서비스를 소개하는 4단계 슬라이드
 */
export default function OnboardingPage() {
  const handleOnboardingComplete = () => {
    // 온보딩 완료 시 처리 (예: 로컬 스토리지에 완료 상태 저장)
    if (typeof window !== 'undefined') {
      localStorage.setItem('pixelo_onboarding_completed', 'true')
    }
  }

  return <OnboardingCarousel onComplete={handleOnboardingComplete} />
}
