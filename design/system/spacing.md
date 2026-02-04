# PIXELO Spacing System

> 픽셀 그리드 기반의 일관된 간격 체계

---

## Base Unit

픽셀 아트의 특성상 8px 그리드 시스템 채택

- **Base Unit**: 8px
- **Scale**: 8의 배수
- **이유**: 픽셀 아트는 8x8, 16x16, 32x32 단위로 제작되므로 UI도 동일한 그리드 사용

---

## Spacing Scale

### Core Spacing Tokens

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| space-0 | 0 | 0px | - |
| space-0.5 | 0.5 | 4px | 매우 좁은 간격 (아이콘 내부) |
| space-1 | 1 | 8px | **기본 단위** (아이콘-텍스트) |
| space-1.5 | 1.5 | 12px | 관련 요소 그룹 |
| space-2 | 2 | 16px | 폼 필드 간격 |
| space-3 | 3 | 24px | **컴포넌트 내부 패딩** |
| space-4 | 4 | 32px | 카드 내부 패딩 |
| space-5 | 5 | 40px | 섹션 내 간격 |
| space-6 | 6 | 48px | 섹션 간 간격 |
| space-8 | 8 | 64px | 주요 섹션 구분 |
| space-10 | 10 | 80px | 페이지 섹션 |
| space-12 | 12 | 96px | 히어로 섹션 |
| space-16 | 16 | 128px | 페이지 상하단 |

### Pixel-Specific Spacing

픽셀 아트 요소에 특화된 간격

| Token | Value | Usage |
|-------|-------|-------|
| pixel-1 | 8px | 픽셀 아트 기본 단위 |
| pixel-2 | 16px | 픽셀 스프라이트 간격 |
| pixel-4 | 32px | 픽셀 캐릭터 간격 |
| pixel-8 | 64px | 픽셀 씬 간격 |

---

## Component Spacing

### Buttons

| Size | Height | Padding X | Padding Y | Gap (icon-text) |
|------|--------|-----------|-----------|-----------------|
| xs | 24px | 8px | 4px | 4px |
| sm | 32px | 12px | 8px | 8px |
| md | 40px | 16px | 8px | 8px |
| lg | 48px | 24px | 12px | 8px |
| xl | 56px | 32px | 16px | 12px |

### Input Fields

| Property | Value |
|----------|-------|
| Height | 40px (sm), 48px (md), 56px (lg) |
| Padding X | 16px |
| Padding Y | 12px |
| Label gap | 8px |
| Helper text gap | 4px |
| Fields gap | 16px |

### Cards

| Variant | Padding | Gap (내부 요소) |
|---------|---------|-----------------|
| Compact | 16px | 8px |
| Default | 24px | 16px |
| Spacious | 32px | 24px |

### Cards between (카드 간 간격)
| Context | Gap |
|---------|-----|
| Grid (작은 카드) | 16px |
| Grid (중간 카드) | 24px |
| List | 16px |
| Featured | 32px |

### Modal / Dialog

| Property | Value |
|----------|-------|
| Padding | 24px (mobile), 32px (desktop) |
| Header-Body gap | 16px |
| Body-Footer gap | 24px |
| Action buttons gap | 12px |

### Navigation

| Property | Value |
|----------|-------|
| Header height | 64px |
| Nav item padding | 12px 16px |
| Nav items gap | 8px |
| Bottom nav height | 64px |
| Bottom nav icon-label gap | 4px |

---

## Layout Spacing

### Container

| Breakpoint | Max Width | Padding X |
|------------|-----------|-----------|
| Mobile | 100% | 16px |
| Tablet (768px+) | 720px | 24px |
| Desktop (1024px+) | 960px | 32px |
| Wide (1280px+) | 1200px | 48px |

### Page Layout

```
┌────────────────────────────────────────────┐
│                  Header (64px)              │
├────────────────────────────────────────────┤
│            Page Padding Top (48px)          │
│  ┌──────────────────────────────────────┐  │
│  │         Content Area                  │  │
│  │                                       │  │
│  │  Section Gap: 64px                    │  │
│  │                                       │  │
│  └──────────────────────────────────────┘  │
│           Page Padding Bottom (96px)        │
├────────────────────────────────────────────┤
│                  Footer                     │
└────────────────────────────────────────────┘
```

| Property | Mobile | Desktop |
|----------|--------|---------|
| Page padding top | 32px | 48px |
| Page padding bottom | 64px | 96px |
| Section gap | 48px | 64px |
| Subsection gap | 32px | 40px |

### Grid System

| Grid | Gap | Usage |
|------|-----|-------|
| 2 columns | 16px | 작은 카드 |
| 3 columns | 24px | 일반 카드 |
| 4 columns | 24px | 갤러리 |
| Masonry | 16px | 불규칙 콘텐츠 |

---

## Pixel Art Specific Layout

### Character Display

```
┌────────────────────────────────────┐
│                                    │
│    ┌──────────────────────────┐    │
│    │    Pixel Character       │    │
│    │    (Max 128x128)         │    │  Padding: 32px
│    │                          │    │
│    └──────────────────────────┘    │
│                                    │
│    Character Name (pixel-heading)  │  Gap: 16px
│    Type Tags                       │  Gap: 8px
│                                    │
└────────────────────────────────────┘
```

### Result Card Layout

```
┌────────────────────────────────────┐
│  Padding: 24px                     │
│  ┌──────────┐                      │
│  │ Pixel    │  Title      Gap:16px │
│  │ Avatar   │  Subtitle   Gap:8px  │
│  │ (64x64)  │                      │
│  └──────────┘                      │
│        Gap: 16px                   │
│  ┌──────────────────────────────┐  │
│  │  Stats Bar                   │  │
│  │  Gap between bars: 12px      │  │
│  └──────────────────────────────┘  │
│                                    │
│  Description text                  │  Gap: 16px
│                                    │
│  [Share] [Save]     Gap: 12px      │  Gap: 24px
└────────────────────────────────────┘
```

---

## Touch Targets

모바일 터치 영역 최소 크기

| Element | Min Size | Recommended |
|---------|----------|-------------|
| Button | 44px | 48px |
| Icon button | 44px | 48px |
| List item | 44px height | 56px |
| Checkbox/Radio | 44px | 48px touch area |
| Tab | 44px | 48px |

---

## Z-Index Scale

레이어 순서 관리

| Token | Value | Usage |
|-------|-------|-------|
| z-base | 0 | 기본 콘텐츠 |
| z-dropdown | 10 | 드롭다운 메뉴 |
| z-sticky | 20 | Sticky 요소 |
| z-fixed | 30 | Fixed 헤더 |
| z-overlay | 40 | 오버레이 배경 |
| z-modal | 50 | 모달 |
| z-popover | 60 | 팝오버, 툴팁 |
| z-toast | 70 | 토스트 알림 |
| z-max | 100 | 최상위 (로딩) |

---

## Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      spacing: {
        // Pixel Grid
        'pixel-1': '8px',
        'pixel-2': '16px',
        'pixel-4': '32px',
        'pixel-8': '64px',

        // Custom tokens
        'header': '64px',
        'page-top': '48px',
        'page-bottom': '96px',
        'section': '64px',
        'card-padding': '24px',
      },
      maxWidth: {
        'container-sm': '720px',
        'container-md': '960px',
        'container-lg': '1200px',
      },
      gap: {
        'card': '24px',
        'card-sm': '16px',
        'button': '12px',
        'form': '16px',
      },
      zIndex: {
        'dropdown': '10',
        'sticky': '20',
        'fixed': '30',
        'overlay': '40',
        'modal': '50',
        'popover': '60',
        'toast': '70',
        'max': '100',
      },
    },
  },
}
```

---

## CSS Variables

```css
:root {
  /* Base */
  --space-unit: 8px;

  /* Scale */
  --space-0: 0;
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-5: 40px;
  --space-6: 48px;
  --space-8: 64px;
  --space-10: 80px;
  --space-12: 96px;
  --space-16: 128px;

  /* Component */
  --space-button-sm: 8px 12px;
  --space-button-md: 12px 16px;
  --space-button-lg: 16px 24px;
  --space-input-padding: 12px 16px;
  --space-card-padding: 24px;
  --space-modal-padding: 32px;

  /* Layout */
  --space-header-height: 64px;
  --space-page-padding-x: 16px;
  --space-page-padding-top: 48px;
  --space-page-padding-bottom: 96px;
  --space-section-gap: 64px;
  --space-container-max: 1200px;

  /* Z-index */
  --z-dropdown: 10;
  --z-sticky: 20;
  --z-fixed: 30;
  --z-overlay: 40;
  --z-modal: 50;
  --z-popover: 60;
  --z-toast: 70;
}

/* Responsive overrides */
@media (max-width: 768px) {
  :root {
    --space-page-padding-top: 32px;
    --space-page-padding-bottom: 64px;
    --space-section-gap: 48px;
    --space-modal-padding: 24px;
  }
}
```

---

## Do's and Don'ts

### Do's
- 8px 그리드에 맞추어 간격 설정
- 토큰 값 사용 (임의 값 지양)
- 관련 요소는 좁게, 구분되는 요소는 넓게
- 모바일에서 터치 영역 충분히 확보

### Don'ts
- 8의 배수가 아닌 간격 사용
- 컴포넌트마다 다른 패딩 적용
- 너무 조밀한 레이아웃 (여백 부족)
- Z-index 임의 값 (999 등) 사용
