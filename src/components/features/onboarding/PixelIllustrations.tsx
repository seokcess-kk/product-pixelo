'use client'

import { cn } from '@/lib/utils'

interface IllustrationProps {
  className?: string
}

/**
 * 픽셀 아트 스타일 PIXELO 로고
 */
export function PixelLogo({ className }: IllustrationProps) {
  return (
    <div className={cn('animate-float', className)}>
      <svg
        viewBox="0 0 128 128"
        className="h-full w-full"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* 배경 원 */}
        <rect x="24" y="24" width="80" height="80" fill="#4D6FFF" />
        <rect x="28" y="28" width="72" height="72" fill="#6B8CFF" />

        {/* P 문자 (픽셀) */}
        <rect x="36" y="40" width="8" height="48" fill="#FFFEF0" />
        <rect x="44" y="40" width="16" height="8" fill="#FFFEF0" />
        <rect x="60" y="40" width="8" height="16" fill="#FFFEF0" />
        <rect x="44" y="56" width="16" height="8" fill="#FFFEF0" />

        {/* 별 장식 */}
        <rect x="76" y="36" width="8" height="8" fill="#FFD93D" />
        <rect x="72" y="40" width="4" height="4" fill="#FFD93D" />
        <rect x="84" y="40" width="4" height="4" fill="#FFD93D" />
        <rect x="76" y="44" width="8" height="4" fill="#FFD93D" />

        {/* 픽셀 장식 */}
        <rect x="72" y="72" width="8" height="8" fill="#FF6B6B" />
        <rect x="84" y="68" width="6" height="6" fill="#55EFC4" />
        <rect x="80" y="80" width="6" height="6" fill="#A855F7" />
      </svg>
    </div>
  )
}

/**
 * 질문 카드 일러스트 - 말풍선과 물음표
 */
export function QuestionIllustration({ className }: IllustrationProps) {
  return (
    <div className={cn('animate-float', className)} style={{ animationDelay: '0.5s' }}>
      <svg
        viewBox="0 0 128 128"
        className="h-full w-full"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* 말풍선 */}
        <rect x="16" y="16" width="96" height="72" fill="#FFFEF0" />
        <rect x="12" y="20" width="4" height="64" fill="#FFFEF0" />
        <rect x="112" y="20" width="4" height="64" fill="#FFFEF0" />

        {/* 말풍선 꼬리 */}
        <rect x="32" y="88" width="16" height="8" fill="#FFFEF0" />
        <rect x="28" y="96" width="12" height="8" fill="#FFFEF0" />
        <rect x="24" y="104" width="8" height="8" fill="#FFFEF0" />

        {/* 외곽선 */}
        <rect x="16" y="12" width="96" height="4" fill="#1A1A2E" />
        <rect x="16" y="88" width="16" height="4" fill="#1A1A2E" />
        <rect x="48" y="88" width="64" height="4" fill="#1A1A2E" />
        <rect x="8" y="16" width="4" height="72" fill="#1A1A2E" />
        <rect x="116" y="16" width="4" height="72" fill="#1A1A2E" />
        <rect x="28" y="92" width="4" height="8" fill="#1A1A2E" />
        <rect x="24" y="100" width="4" height="8" fill="#1A1A2E" />
        <rect x="20" y="108" width="4" height="8" fill="#1A1A2E" />
        <rect x="32" y="112" width="8" height="4" fill="#1A1A2E" />

        {/* 물음표 */}
        <rect x="48" y="32" width="32" height="8" fill="#4D6FFF" />
        <rect x="72" y="40" width="8" height="16" fill="#4D6FFF" />
        <rect x="56" y="48" width="24" height="8" fill="#4D6FFF" />
        <rect x="56" y="56" width="8" height="8" fill="#4D6FFF" />
        <rect x="56" y="72" width="8" height="8" fill="#4D6FFF" />
      </svg>
    </div>
  )
}

/**
 * 오브젝트/픽셀 획득 일러스트
 */
export function ObjectIllustration({ className }: IllustrationProps) {
  return (
    <div className={cn('animate-float', className)} style={{ animationDelay: '1s' }}>
      <svg
        viewBox="0 0 128 128"
        className="h-full w-full"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* 중앙 보석 */}
        <rect x="48" y="24" width="32" height="8" fill="#A855F7" />
        <rect x="40" y="32" width="48" height="8" fill="#C084FC" />
        <rect x="36" y="40" width="56" height="24" fill="#A855F7" />
        <rect x="40" y="64" width="48" height="16" fill="#7C3AED" />
        <rect x="48" y="80" width="32" height="8" fill="#6D28D9" />

        {/* 하이라이트 */}
        <rect x="44" y="44" width="8" height="8" fill="#E9D5FF" />
        <rect x="52" y="36" width="4" height="4" fill="#E9D5FF" />

        {/* 별 효과들 */}
        <rect x="16" y="32" width="8" height="8" fill="#FFD93D" />
        <rect x="12" y="36" width="4" height="4" fill="#FFD93D" />
        <rect x="24" y="36" width="4" height="4" fill="#FFD93D" />

        <rect x="104" y="48" width="8" height="8" fill="#FFD93D" />
        <rect x="100" y="52" width="4" height="4" fill="#FFD93D" />
        <rect x="112" y="52" width="4" height="4" fill="#FFD93D" />

        <rect x="24" y="88" width="6" height="6" fill="#55EFC4" />
        <rect x="96" y="24" width="6" height="6" fill="#FF6B6B" />

        {/* +1 텍스트 */}
        <rect x="84" y="72" width="4" height="16" fill="#4D6FFF" />
        <rect x="76" y="80" width="20" height="4" fill="#4D6FFF" />
        <rect x="100" y="76" width="4" height="4" fill="#4D6FFF" />
        <rect x="104" y="72" width="4" height="16" fill="#4D6FFF" />
      </svg>
    </div>
  )
}

/**
 * 공간 완성 일러스트 - 작은 방/그리드
 */
export function SpaceIllustration({ className }: IllustrationProps) {
  return (
    <div className={cn('animate-float', className)} style={{ animationDelay: '1.5s' }}>
      <svg
        viewBox="0 0 128 128"
        className="h-full w-full"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* 방 배경 */}
        <rect x="16" y="32" width="96" height="80" fill="#F0F4FF" />

        {/* 바닥 그리드 */}
        <rect x="16" y="80" width="96" height="32" fill="#DFE7FF" />
        <rect x="16" y="88" width="96" height="4" fill="#C4D4FF" />
        <rect x="16" y="96" width="96" height="4" fill="#C4D4FF" />
        <rect x="16" y="104" width="96" height="4" fill="#C4D4FF" />
        <rect x="40" y="80" width="4" height="32" fill="#C4D4FF" />
        <rect x="64" y="80" width="4" height="32" fill="#C4D4FF" />
        <rect x="88" y="80" width="4" height="32" fill="#C4D4FF" />

        {/* 픽셀 오브젝트 - 식물 */}
        <rect x="24" y="56" width="16" height="4" fill="#55EFC4" />
        <rect x="28" y="52" width="8" height="4" fill="#55EFC4" />
        <rect x="28" y="60" width="8" height="16" fill="#8B4513" />
        <rect x="24" y="72" width="16" height="8" fill="#D2691E" />

        {/* 픽셀 오브젝트 - 램프 */}
        <rect x="84" y="44" width="16" height="8" fill="#FFD93D" />
        <rect x="80" y="52" width="24" height="4" fill="#FFC312" />
        <rect x="88" y="56" width="8" height="20" fill="#A0522D" />

        {/* 픽셀 오브젝트 - 하트 */}
        <rect x="52" y="44" width="8" height="8" fill="#FF6B6B" />
        <rect x="68" y="44" width="8" height="8" fill="#FF6B6B" />
        <rect x="48" y="48" width="32" height="8" fill="#FF6B6B" />
        <rect x="52" y="56" width="24" height="8" fill="#FF6B6B" />
        <rect x="56" y="64" width="16" height="8" fill="#FF6B6B" />
        <rect x="60" y="72" width="8" height="4" fill="#FF6B6B" />

        {/* 테두리 */}
        <rect x="12" y="28" width="104" height="4" fill="#1A1A2E" />
        <rect x="12" y="112" width="104" height="4" fill="#1A1A2E" />
        <rect x="12" y="28" width="4" height="88" fill="#1A1A2E" />
        <rect x="112" y="28" width="4" height="88" fill="#1A1A2E" />
      </svg>
    </div>
  )
}

/**
 * 시작하기 일러스트 - 캐릭터와 화살표
 */
export function StartIllustration({ className }: IllustrationProps) {
  return (
    <div className={cn('animate-float', className)}>
      <svg
        viewBox="0 0 128 128"
        className="h-full w-full"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* 캐릭터 몸체 */}
        <rect x="48" y="32" width="32" height="32" fill="#4D6FFF" />
        <rect x="44" y="36" width="8" height="24" fill="#4D6FFF" />
        <rect x="76" y="36" width="8" height="24" fill="#4D6FFF" />

        {/* 캐릭터 얼굴 배경 */}
        <rect x="52" y="36" width="24" height="24" fill="#FFFEF0" />

        {/* 눈 */}
        <rect x="56" y="44" width="4" height="4" fill="#1A1A2E" />
        <rect x="68" y="44" width="4" height="4" fill="#1A1A2E" />

        {/* 입 - 미소 */}
        <rect x="56" y="52" width="4" height="4" fill="#FF6B6B" />
        <rect x="60" y="56" width="8" height="4" fill="#FF6B6B" />
        <rect x="68" y="52" width="4" height="4" fill="#FF6B6B" />

        {/* 다리 */}
        <rect x="52" y="64" width="8" height="16" fill="#1A1A2E" />
        <rect x="68" y="64" width="8" height="16" fill="#1A1A2E" />

        {/* 화살표 - 앞으로 */}
        <rect x="88" y="48" width="24" height="8" fill="#FFD93D" />
        <rect x="104" y="40" width="8" height="8" fill="#FFD93D" />
        <rect x="104" y="56" width="8" height="8" fill="#FFD93D" />
        <rect x="112" y="48" width="8" height="8" fill="#FFD93D" />

        {/* 발판 */}
        <rect x="40" y="80" width="48" height="8" fill="#1A1A2E" />

        {/* 별 장식 */}
        <rect x="20" y="24" width="8" height="8" fill="#FFD93D" />
        <rect x="16" y="28" width="4" height="4" fill="#FFD93D" />
        <rect x="28" y="28" width="4" height="4" fill="#FFD93D" />

        <rect x="24" y="96" width="6" height="6" fill="#55EFC4" />
        <rect x="100" y="88" width="6" height="6" fill="#A855F7" />
        <rect x="36" y="20" width="4" height="4" fill="#FF6B6B" />
      </svg>
    </div>
  )
}
