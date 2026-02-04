# PIXELO Component Styles

> 픽셀 아트 감성과 현대적 UI의 조화

---

## Design Principles

1. **Pixel Border**: 픽셀 느낌의 외곽선 활용
2. **Modern Convenience**: 현대적 사용성 유지
3. **Playful Interaction**: 게임적 인터랙션
4. **Consistency**: 일관된 토큰 사용

---

## Buttons

### Variants

#### Primary Button (픽셀 스타일)
게임의 메인 액션 버튼 느낌

```
┌────────────────────────┐
│  ■■■■■■■■■■■■■■■■■■  │  <- 픽셀 보더
│  ■   START GAME    ■  │
│  ■■■■■■■■■■■■■■■■■■  │
└────────────────────────┘
```

| Property | Value |
|----------|-------|
| Background | primary-500 |
| Text | white |
| Border | 4px solid primary-700 (하단, 우측) |
| Border Light | 4px solid primary-300 (상단, 좌측) |
| Font | DungGeunMo (pixel) |
| Hover | background primary-600 |
| Active | border 반전 (눌린 효과) |

#### Secondary Button
보조 액션용

| Property | Value |
|----------|-------|
| Background | white |
| Text | gray-700 |
| Border | 2px solid gray-300 |
| Hover | background gray-50 |
| Active | background gray-100 |

#### Ghost Button
텍스트 링크 스타일

| Property | Value |
|----------|-------|
| Background | transparent |
| Text | primary-500 |
| Border | none |
| Hover | background primary-50 |
| Active | background primary-100 |

#### Pixel Outline Button
픽셀 외곽선만 있는 버튼

| Property | Value |
|----------|-------|
| Background | transparent |
| Text | primary-500 |
| Border | 2px dashed primary-500 (픽셀 느낌) |
| Hover | background primary-50 |

#### Icon Button (Pixel)
아이콘만 있는 정사각형 버튼

| Property | Value |
|----------|-------|
| Size | 40px x 40px (md) |
| Background | gray-100 |
| Border Radius | 8px |
| Hover | background gray-200 |

### Sizes

| Size | Height | Padding | Font Size | Icon |
|------|--------|---------|-----------|------|
| xs | 24px | 4px 8px | 12px | 14px |
| sm | 32px | 8px 12px | 14px | 16px |
| md | 40px | 8px 16px | 16px | 20px |
| lg | 48px | 12px 24px | 18px | 24px |
| xl | 56px | 16px 32px | 20px | 28px |

### States

| State | Style Change |
|-------|--------------|
| Default | 기본 스타일 |
| Hover | 배경 어둡게, 커서 pointer |
| Focus | outline 2px primary-500, offset 2px |
| Active | 눌린 효과 (픽셀 보더 반전) |
| Disabled | opacity 0.5, cursor not-allowed |
| Loading | 스피너 표시, 텍스트 유지 또는 숨김 |

### CSS Example

```css
/* Primary Pixel Button */
.btn-primary-pixel {
  background: var(--color-primary-500);
  color: white;
  font-family: 'DungGeunMo', monospace;
  padding: 12px 24px;
  border: none;
  position: relative;

  /* 픽셀 3D 효과 */
  box-shadow:
    inset -4px -4px 0 var(--color-primary-700),
    inset 4px 4px 0 var(--color-primary-300);
}

.btn-primary-pixel:active {
  box-shadow:
    inset 4px 4px 0 var(--color-primary-700),
    inset -4px -4px 0 var(--color-primary-300);
}
```

---

## Cards

### Base Card

| Property | Value |
|----------|-------|
| Background | white |
| Border Radius | 12px |
| Border | 1px solid gray-200 |
| Padding | 24px |
| Shadow | 0 2px 8px rgba(0,0,0,0.08) |

### Pixel Card
픽셀 아트 스타일 카드

```
╔══════════════════════════════╗
║                              ║
║   Content Area               ║
║                              ║
╚══════════════════════════════╝
```

| Property | Value |
|----------|-------|
| Background | white |
| Border | 4px solid pixel-black |
| Border Style | 단계별 픽셀 모서리 |
| Padding | 24px |
| Shadow | 4px 4px 0 gray-900 |

### Result Card (테스트 결과)
측정 결과 표시용 특수 카드

| Property | Value |
|----------|-------|
| Background | gradient (축 컬러 기반) |
| Border | 4px solid 축 컬러-dark |
| Border Radius | 16px |
| Padding | 32px |
| Character Area | 중앙 배치, 128x128 |

### Variants

| Variant | Use Case | Special Style |
|---------|----------|---------------|
| Default | 일반 콘텐츠 | 기본 |
| Elevated | 강조 카드 | shadow 강화 |
| Outlined | 리스트 아이템 | border만, shadow 없음 |
| Pixel | 게임 요소 | 픽셀 보더 |
| Gradient | 결과 카드 | 배경 그라디언트 |

### Card Interaction

```css
/* Hover lift effect */
.card-interactive {
  transition: transform 200ms ease, box-shadow 200ms ease;
}

.card-interactive:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

/* Pixel card press effect */
.card-pixel:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 var(--color-gray-900);
}
```

---

## Input Fields

### Text Input

| Property | Value |
|----------|-------|
| Height | 48px |
| Background | white |
| Border | 2px solid gray-300 |
| Border Radius | 8px |
| Padding | 12px 16px |
| Font | Pretendard 16px |
| Placeholder | gray-400 |

### States

| State | Border | Background | Other |
|-------|--------|------------|-------|
| Default | gray-300 | white | - |
| Hover | gray-400 | white | - |
| Focus | primary-500 | white | ring 2px primary-100 |
| Error | error-main | error-light | helper text red |
| Disabled | gray-200 | gray-50 | text gray-400 |

### Pixel Input (Optional)
게임 요소용 입력 필드

| Property | Value |
|----------|-------|
| Border | 3px solid pixel-black |
| Border Radius | 0 |
| Font | DungGeunMo |
| Background | #FFFEF0 (pixel-white) |

### Input with Label

```
Label Text                 (Optional)
┌────────────────────────────────────┐
│  Placeholder text                  │
└────────────────────────────────────┘
Helper text or error message
```

| Element | Style |
|---------|-------|
| Label | body-sm, semibold, gray-700 |
| Gap (label-input) | 8px |
| Helper | caption, gray-500 |
| Error | caption, error-main |
| Gap (input-helper) | 4px |

### Select / Dropdown

| Property | Value |
|----------|-------|
| Same as Input | height, border, padding |
| Arrow | chevron-down icon, gray-500 |
| Dropdown | white, shadow-lg, border-radius 8px |
| Option hover | gray-50 |
| Option selected | primary-50, primary-500 text |

---

## Modal / Dialog

### Base Modal

```
┌──────────────────────────────────────┐
│  Modal Title                    [X]  │
├──────────────────────────────────────┤
│                                      │
│  Modal content goes here.            │
│  Can include forms, text, etc.       │
│                                      │
├──────────────────────────────────────┤
│              [Cancel]  [Confirm]     │
└──────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Background | white |
| Border Radius | 16px |
| Padding | 24px (mobile), 32px (desktop) |
| Max Width | 480px (sm), 640px (md), 800px (lg) |
| Shadow | 0 24px 48px rgba(0,0,0,0.2) |
| Overlay | black, opacity 0.5 |

### Pixel Modal (Game Style)

| Property | Value |
|----------|-------|
| Border | 6px solid pixel-black |
| Background | #FFFEF0 |
| Title Font | DungGeunMo |
| Corner Style | 픽셀 모서리 |

### Modal Sections

| Section | Style |
|---------|-------|
| Header | border-bottom 1px gray-200, padding-bottom 16px |
| Body | padding 16px 0 |
| Footer | border-top 1px gray-200, padding-top 16px, flex justify-end gap 12px |

### Animation

```css
/* Modal enter */
.modal-enter {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

.modal-enter-active {
  opacity: 1;
  transform: scale(1) translateY(0);
  transition: all 200ms ease-out;
}

/* Overlay */
.overlay-enter {
  opacity: 0;
}

.overlay-enter-active {
  opacity: 1;
  transition: opacity 200ms ease;
}
```

---

## Progress Bar

### Linear Progress

```
┌────────────────────────────────────────────────┐
│████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░│ 45%
└────────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Height | 8px (sm), 12px (md), 16px (lg) |
| Background | gray-200 |
| Fill | primary-500 (또는 축 컬러) |
| Border Radius | full (pill) |

### Pixel Progress Bar

```
[████████████░░░░░░░░░░░░] 50%
```

| Property | Value |
|----------|-------|
| Height | 16px, 24px |
| Background | gray-200 |
| Fill | 픽셀 단위로 채움 |
| Border | 2px solid pixel-black |
| Segments | visible (8px 단위) |

### Axis Progress (측정축용)

각 축 컬러로 표시되는 양방향 프로그레스바

```
내향 ◀[░░░░░████████████░░░░░]▶ 외향
          현재 위치
```

| Property | Value |
|----------|-------|
| Width | 100% |
| Height | 24px |
| Background | gray-100 |
| Fill Left | 축 컬러 (gradient) |
| Fill Right | 축 컬러 보색 |
| Indicator | 현재 위치 마커 |

### Circular Progress

| Property | Value |
|----------|-------|
| Size | 48px (sm), 80px (md), 120px (lg) |
| Stroke Width | 4px (sm), 6px (md), 8px (lg) |
| Background | gray-200 |
| Fill | primary-500 |
| Center | 숫자 또는 아이콘 |

### Stats Bar (게임 스타일)

```
HP  [██████████████████████░░░░] 85/100
MP  [████████░░░░░░░░░░░░░░░░░░] 30/100
EXP [████████████░░░░░░░░░░░░░░] 45/100
```

| Property | Value |
|----------|-------|
| Label | pixel font, 고정 너비 |
| Bar | 픽셀 보더, 단계별 채움 |
| Value | mono font, 우측 정렬 |

---

## Tags / Badges

### Tag

| Property | Value |
|----------|-------|
| Height | 24px (sm), 28px (md) |
| Padding | 4px 8px (sm), 6px 12px (md) |
| Border Radius | 6px |
| Font | body-sm |
| Background | primary-100 |
| Text | primary-700 |

### Pixel Tag

| Property | Value |
|----------|-------|
| Border | 2px solid |
| Border Radius | 0 |
| Font | DungGeunMo, 12px |
| Background | 컬러-light |
| Text | 컬러-dark |

### Badge (Count)

| Property | Value |
|----------|-------|
| Size | 20px min |
| Shape | circle 또는 pill |
| Background | error (notification) |
| Text | white, 12px, bold |

### Axis Tag

각 측정축을 나타내는 태그

| Axis | Background | Text | Icon |
|------|------------|------|------|
| Energy | energy-light | energy-dark | lightning |
| Lifestyle | lifestyle-light | lifestyle-dark | calendar |
| Emotion | emotion-light | emotion-dark | heart |
| Aesthetic | aesthetic-light | aesthetic-dark | palette |
| Social | social-light | social-dark | users |
| Challenge | challenge-light | challenge-dark | mountain |
| Relation | relation-light | relation-dark | link |

---

## Avatar

### User Avatar

| Size | Dimension | Border Radius |
|------|-----------|---------------|
| xs | 24px | 6px |
| sm | 32px | 8px |
| md | 48px | 12px |
| lg | 64px | 16px |
| xl | 96px | 20px |

### Pixel Avatar (Character)

| Size | Dimension | Style |
|------|-----------|-------|
| sm | 32x32 | 픽셀 캐릭터 |
| md | 64x64 | 상세 픽셀 |
| lg | 128x128 | 고해상 픽셀 |

| Property | Value |
|----------|-------|
| Background | 축 컬러-light |
| Border | 3px solid pixel-black |
| Image rendering | pixelated |

```css
.pixel-avatar {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
```

---

## Tabs

### Modern Tabs

| Property | Value |
|----------|-------|
| Height | 48px |
| Padding | 12px 16px |
| Border Bottom | 2px solid gray-200 |
| Active Tab | border-bottom primary-500, text primary-500 |
| Hover | background gray-50 |

### Pixel Tabs

```
┌────────┐ ┌────────┐ ┌────────┐
│ Tab 1  │ │ Tab 2  │ │ Tab 3  │
└────────┴─┴────────┴─┴────────┴─────────
```

| Property | Value |
|----------|-------|
| Border | 2px solid pixel-black |
| Active | 하단 보더 없음, 배경 연결 |
| Inactive | 배경 gray-100 |

---

## Toast / Notification

### Modern Toast

| Property | Value |
|----------|-------|
| Position | bottom-center 또는 top-right |
| Width | auto (min 280px, max 420px) |
| Padding | 16px |
| Border Radius | 12px |
| Shadow | 0 8px 24px rgba(0,0,0,0.15) |

### Variants by Type

| Type | Background | Icon | Border Left |
|------|------------|------|-------------|
| Success | white | check-circle green | 4px success |
| Error | white | x-circle red | 4px error |
| Warning | white | alert-triangle orange | 4px warning |
| Info | white | info blue | 4px info |

### Pixel Toast (Achievement)

게임 업적 스타일 알림

```
╔════════════════════════════════╗
║ ⭐ ACHIEVEMENT UNLOCKED!       ║
║    첫 테스트 완료!              ║
╚════════════════════════════════╝
```

| Property | Value |
|----------|-------|
| Background | pixel-gold gradient |
| Border | 4px solid pixel-black |
| Font | DungGeunMo |
| Animation | slide-in + bounce |

---

## Tooltip

| Property | Value |
|----------|-------|
| Background | gray-900 |
| Text | white, body-sm |
| Padding | 8px 12px |
| Border Radius | 6px |
| Max Width | 240px |
| Arrow | 6px triangle |

### Delay & Animation

| Property | Value |
|----------|-------|
| Show delay | 300ms |
| Hide delay | 100ms |
| Animation | fade-in 150ms |

---

## Loading States

### Spinner

| Size | Dimension | Stroke |
|------|-----------|--------|
| sm | 16px | 2px |
| md | 24px | 3px |
| lg | 40px | 4px |
| xl | 64px | 6px |

| Property | Value |
|----------|-------|
| Color | primary-500 |
| Animation | rotate 1s linear infinite |

### Pixel Loading

```
Loading... ▓░░░░░░░
Loading... ▓▓░░░░░░
Loading... ▓▓▓░░░░░
```

| Property | Value |
|----------|-------|
| Font | DungGeunMo |
| Animation | 블록 단위 채움 |
| Duration | 각 블록 150ms |

### Skeleton

| Property | Value |
|----------|-------|
| Background | gray-200 |
| Animation | shimmer (gradient slide) |
| Border Radius | 컴포넌트와 동일 |

---

## Tailwind Component Classes

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      boxShadow: {
        'pixel': '4px 4px 0 var(--color-gray-900)',
        'pixel-sm': '2px 2px 0 var(--color-gray-900)',
        'pixel-pressed': '2px 2px 0 var(--color-gray-900)',
        'card': '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.12)',
        'modal': '0 24px 48px rgba(0,0,0,0.2)',
      },
      borderWidth: {
        '3': '3px',
        'pixel': '4px',
      },
      animation: {
        'pixel-blink': 'blink 1s step-end infinite',
        'pixel-bounce': 'pixelBounce 0.5s ease',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        pixelBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
}
```
