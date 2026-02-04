# PIXELO Design System

> "픽셀로 만나는 나의 세계"

레트로 픽셀 아트와 현대적 감성을 조화롭게 결합한 PIXELO 서비스의 디자인 시스템입니다.

---

## Overview

| 항목 | 내용 |
|------|------|
| **서비스명** | 픽셀로 (PIXELO) |
| **슬로건** | "픽셀로 만나는 나의 세계" |
| **타겟** | MZ세대 (10대~30대) |
| **스타일** | 레트로 픽셀 아트 + 현대적 감성 |
| **톤앤매너** | 밝고, 친근하고, 플레이풀 |

---

## Design Files

| File | Description |
|------|-------------|
| [colors.md](./colors.md) | 컬러 팔레트 (Primary, 7축, Semantic, Seasonal) |
| [typography.md](./typography.md) | 타이포그래피 (픽셀 폰트 + 현대 폰트) |
| [spacing.md](./spacing.md) | 간격 시스템 (8px 그리드 기반) |
| [components.md](./components.md) | UI 컴포넌트 스타일 |
| [animations.md](./animations.md) | 애니메이션 가이드 |
| [tokens.css](./tokens.css) | CSS 변수 정의 |

---

## Quick Reference

### Primary Color
```css
--color-primary-500: #4D6FFF;  /* Main */
--color-primary-600: #3B54DB;  /* Hover */
--color-primary-700: #2E41B8;  /* Active */
```

### 7 Axis Colors

| Axis | Korean | Color | Hex |
|------|--------|-------|-----|
| Energy | 에너지 방향 | Coral Red | #FF6B6B |
| Lifestyle | 생활 패턴 | Amber Orange | #FFB347 |
| Emotion | 감성 스타일 | Rose Pink | #FF85A2 |
| Aesthetic | 미적 취향 | Mint Green | #55EFC4 |
| Social | 사회적 성향 | Sky Cyan | #74B9FF |
| Challenge | 도전 성향 | Electric Purple | #A855F7 |
| Relationship | 관계 방식 | Warm Yellow | #FDCB6E |

### Fonts
```css
--font-pixel: 'DungGeunMo', 'Press Start 2P', monospace;  /* 제목, 게임 요소 */
--font-sans: 'Pretendard Variable', sans-serif;           /* 본문 */
--font-mono: 'JetBrains Mono', monospace;                 /* 숫자 */
```

### Spacing (8px Grid)
```css
--space-1: 8px;    /* 기본 단위 */
--space-2: 16px;   /* 폼 필드 간격 */
--space-3: 24px;   /* 컴포넌트 패딩 */
--space-4: 32px;   /* 카드 패딩 */
--space-6: 48px;   /* 섹션 간격 */
--space-8: 64px;   /* 주요 섹션 */
```

---

## Key Principles

### 1. Pixel-Perfect
- 8px 그리드 시스템 준수
- 픽셀 아트는 정수 배율로 렌더링
- `image-rendering: pixelated` 적용

### 2. Dual Style
- **게임 요소**: 픽셀 폰트, 픽셀 보더, step 애니메이션
- **일반 UI**: 현대 폰트, 부드러운 라운드, smooth 트랜지션

### 3. Playful but Usable
- 재미있는 인터랙션
- 명확한 피드백
- 접근성 기준 준수 (WCAG AA)

### 4. Consistent Theming
- 7개 축마다 고유 컬러
- 축 컬러는 해당 맥락에서만 사용
- 시즌별 테마 확장 가능

---

## Implementation

### CSS Variables
```html
<link rel="stylesheet" href="/design/system/tokens.css">
```

### Tailwind Config
디자인 토큰을 Tailwind에 통합:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          // ...
        },
        axis: {
          energy: 'var(--color-energy-main)',
          lifestyle: 'var(--color-lifestyle-main)',
          emotion: 'var(--color-emotion-main)',
          aesthetic: 'var(--color-aesthetic-main)',
          social: 'var(--color-social-main)',
          challenge: 'var(--color-challenge-main)',
          relation: 'var(--color-relation-main)',
        }
      },
      fontFamily: {
        pixel: 'var(--font-pixel)',
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
      spacing: {
        'pixel-1': 'var(--space-pixel-1)',
        'pixel-2': 'var(--space-pixel-2)',
        'pixel-4': 'var(--space-pixel-4)',
      }
    }
  }
}
```

---

## Component Usage Examples

### Pixel Button
```jsx
<button className="
  bg-primary-500 text-white
  font-pixel text-pixel-body
  px-6 py-3
  border-0
  shadow-[inset_-4px_-4px_0_var(--color-primary-700),inset_4px_4px_0_var(--color-primary-300)]
  active:shadow-[inset_4px_4px_0_var(--color-primary-700),inset_-4px_-4px_0_var(--color-primary-300)]
  active:translate-x-0.5 active:translate-y-0.5
">
  START GAME
</button>
```

### Axis Tag
```jsx
<span className="
  inline-flex items-center
  px-3 py-1
  bg-energy-light text-energy-dark
  font-pixel text-pixel-caption
  border-2 border-current
">
  에너지
</span>
```

### Pixel Card
```jsx
<div className="
  bg-white
  border-4 border-pixel-black
  shadow-pixel
  p-6
  active:shadow-pixel-pressed
  active:translate-x-0.5 active:translate-y-0.5
">
  {/* Content */}
</div>
```

---

## Checklist for Designers/Developers

### Before Implementation
- [ ] tokens.css 임포트 확인
- [ ] 폰트 로딩 설정 (Pretendard, DungGeunMo)
- [ ] Tailwind 설정 확인

### During Implementation
- [ ] 8px 그리드 준수
- [ ] 토큰 값 사용 (임의 값 지양)
- [ ] 픽셀 요소에 `image-rendering: pixelated` 적용
- [ ] 모든 상태 스타일 적용 (hover, focus, active, disabled)

### Before Release
- [ ] 색상 대비 검증 (4.5:1 이상)
- [ ] 터치 영역 확인 (44px 이상)
- [ ] reduced-motion 테스트
- [ ] 다크모드 테스트

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-02-04 | Initial design system |

---

## Contact

디자인 시스템 관련 문의: @ui-designer
