# PIXELO Animation Guide

> 픽셀 아트 친화적인 애니메이션과 마이크로인터랙션

---

## Animation Principles

### PIXELO 애니메이션 철학

1. **Pixel-Perfect**: 8px 단위 움직임 우선
2. **Playful**: 게임처럼 재미있는 피드백
3. **Purposeful**: 의미 있는 애니메이션만
4. **Performance**: 60fps 유지

### 레트로 vs 현대적 밸런스

| Context | Style | Example |
|---------|-------|---------|
| 게임 요소 | Step animation (프레임 단위) | 캐릭터 이동, 픽셀 UI |
| 일반 UI | Smooth easing | 모달, 트랜지션 |
| 피드백 | Bounce + Step 혼합 | 버튼 클릭, 알림 |

---

## Timing Tokens

### Duration

| Token | Value | Usage |
|-------|-------|-------|
| instant | 0ms | 즉각 반응 |
| fast | 100ms | 호버, 포커스 |
| normal | 200ms | **기본 트랜지션** |
| slow | 300ms | 모달, 패널 |
| slower | 500ms | 페이지 전환 |
| pixel | 150ms | 픽셀 애니메이션 프레임 |

### Easing

| Token | Value | Usage |
|-------|-------|-------|
| linear | linear | 로딩, 무한 회전 |
| ease-out | cubic-bezier(0, 0, 0.2, 1) | 진입 애니메이션 |
| ease-in | cubic-bezier(0.4, 0, 1, 1) | 퇴장 애니메이션 |
| ease-in-out | cubic-bezier(0.4, 0, 0.2, 1) | **기본** |
| bounce | cubic-bezier(0.68, -0.55, 0.265, 1.55) | 플레이풀 |
| step | steps(N, end) | **픽셀 애니메이션** |

---

## Micro-interactions

### Button Press

#### Modern Button
```css
.btn-modern {
  transition: transform 100ms ease, background 100ms ease;
}

.btn-modern:hover {
  background: var(--color-primary-600);
}

.btn-modern:active {
  transform: scale(0.98);
}
```

#### Pixel Button (3D Press Effect)
```css
.btn-pixel {
  box-shadow:
    inset -4px -4px 0 var(--color-primary-700),
    inset 4px 4px 0 var(--color-primary-300);
  transition: box-shadow 50ms step-end;
}

.btn-pixel:active {
  box-shadow:
    inset 4px 4px 0 var(--color-primary-700),
    inset -4px -4px 0 var(--color-primary-300);
  transform: translate(2px, 2px);
}
```

### Hover Effects

#### Card Lift
```css
.card {
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.12);
}
```

#### Pixel Card Bounce
```css
.card-pixel {
  transition: transform 100ms steps(2);
}

.card-pixel:hover {
  transform: translateY(-8px);
}
```

#### Icon Wiggle
```css
@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

.icon-interactive:hover {
  animation: wiggle 300ms ease;
}
```

### Focus Indicators

```css
/* Ring focus */
.focus-ring:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--color-primary-100),
              0 0 0 5px var(--color-primary-500);
}

/* Pixel focus (blinking border) */
@keyframes pixel-focus {
  0%, 100% { border-color: var(--color-primary-500); }
  50% { border-color: transparent; }
}

.pixel-focus:focus-visible {
  animation: pixel-focus 1s step-end infinite;
}
```

### Toggle / Switch

```css
.toggle-track {
  transition: background 200ms ease;
}

.toggle-thumb {
  transition: transform 200ms ease-out;
}

.toggle-thumb.active {
  transform: translateX(20px);
}
```

---

## Page Transitions

### Fade

```css
/* Enter */
.page-enter {
  opacity: 0;
}

.page-enter-active {
  opacity: 1;
  transition: opacity 300ms ease-out;
}

/* Exit */
.page-exit {
  opacity: 1;
}

.page-exit-active {
  opacity: 0;
  transition: opacity 200ms ease-in;
}
```

### Slide

```css
/* Slide from right */
.slide-enter {
  transform: translateX(100%);
}

.slide-enter-active {
  transform: translateX(0);
  transition: transform 300ms ease-out;
}

.slide-exit-active {
  transform: translateX(-100%);
  transition: transform 300ms ease-in;
}
```

### Pixel Wipe (특수)

화면이 픽셀 단위로 채워지거나 사라지는 효과

```css
@keyframes pixel-wipe-in {
  0% {
    clip-path: inset(0 100% 0 0);
  }
  100% {
    clip-path: inset(0 0 0 0);
  }
}

.pixel-wipe-enter {
  animation: pixel-wipe-in 500ms steps(10) forwards;
}
```

---

## Loading Animations

### Modern Spinner

```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

### Pixel Loading Bar

```css
@keyframes pixel-load {
  0% { width: 0%; }
  100% { width: 100%; }
}

.pixel-loader {
  animation: pixel-load 2s steps(10) infinite;
}
```

### Dots Loading

```css
@keyframes dot-bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-8px); }
}

.dot-1 { animation: dot-bounce 1.4s ease-in-out infinite; }
.dot-2 { animation: dot-bounce 1.4s ease-in-out 0.2s infinite; }
.dot-3 { animation: dot-bounce 1.4s ease-in-out 0.4s infinite; }
```

### Skeleton Shimmer

```css
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-gray-200) 25%,
    var(--color-gray-100) 50%,
    var(--color-gray-200) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

---

## Pixel Art Specific Animations

### Character Idle

프레임 기반 캐릭터 대기 애니메이션

```css
@keyframes character-idle {
  0%, 100% { background-position: 0 0; }
  50% { background-position: -64px 0; }
}

.character {
  width: 64px;
  height: 64px;
  background: url('/sprites/character.png');
  animation: character-idle 1s steps(1) infinite;
  image-rendering: pixelated;
}
```

### Character Walk

```css
@keyframes character-walk {
  0% { background-position: 0 0; }
  25% { background-position: -64px 0; }
  50% { background-position: -128px 0; }
  75% { background-position: -192px 0; }
  100% { background-position: 0 0; }
}

.character-walking {
  animation: character-walk 0.6s steps(1) infinite;
}
```

### Pixel Bounce

8px 단위로 튀는 애니메이션

```css
@keyframes pixel-bounce {
  0%, 100% { transform: translateY(0); }
  25% { transform: translateY(-8px); }
  50% { transform: translateY(0); }
  75% { transform: translateY(-4px); }
}

.pixel-bounce {
  animation: pixel-bounce 0.5s steps(4) forwards;
}
```

### Pixel Shake

```css
@keyframes pixel-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

.pixel-shake {
  animation: pixel-shake 0.3s steps(5);
}
```

### Text Typing (Pixel)

```css
@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blink-caret {
  0%, 100% { border-color: transparent; }
  50% { border-color: var(--color-gray-900); }
}

.pixel-typing {
  font-family: 'DungGeunMo', monospace;
  overflow: hidden;
  white-space: nowrap;
  border-right: 4px solid;
  animation:
    typing 2s steps(20) forwards,
    blink-caret 1s step-end infinite;
}
```

---

## Achievement / Reward Animations

### Star Burst

```css
@keyframes star-burst {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(360deg);
    opacity: 1;
  }
}

.star-reward {
  animation: star-burst 0.6s ease-out forwards;
}
```

### Coin Collect

```css
@keyframes coin-collect {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-40px) scale(0.5);
    opacity: 0;
  }
}

.coin {
  animation: coin-collect 0.5s ease-out forwards;
}
```

### Achievement Unlock

```css
@keyframes achievement-unlock {
  0% {
    transform: translateY(100px) scale(0.8);
    opacity: 0;
  }
  40% {
    transform: translateY(-10px) scale(1.1);
    opacity: 1;
  }
  60% {
    transform: translateY(5px) scale(0.95);
  }
  100% {
    transform: translateY(0) scale(1);
  }
}

.achievement-toast {
  animation: achievement-unlock 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}
```

### Level Up

```css
@keyframes level-up-text {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes level-up-glow {
  0%, 100% {
    box-shadow: 0 0 0 0 var(--color-pixel-gold);
  }
  50% {
    box-shadow: 0 0 30px 10px var(--color-pixel-gold);
  }
}

.level-up {
  animation:
    level-up-text 0.5s ease-out forwards,
    level-up-glow 1s ease-in-out 0.5s;
}
```

---

## Progress Animations

### Bar Fill

```css
@keyframes fill-bar {
  from { width: 0%; }
  to { width: var(--progress); }
}

.progress-bar-fill {
  animation: fill-bar 1s ease-out forwards;
}
```

### Pixel Bar Fill

```css
@keyframes pixel-fill {
  from { width: 0%; }
  to { width: var(--progress); }
}

.pixel-progress-fill {
  animation: pixel-fill 1s steps(10) forwards;
}
```

### Counter Roll

```css
@keyframes roll-number {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.number-roll {
  animation: roll-number 0.5s ease-out forwards;
}
```

---

## Modal & Overlay Animations

### Modal Enter

```css
/* Backdrop */
.modal-backdrop-enter {
  opacity: 0;
}

.modal-backdrop-enter-active {
  opacity: 1;
  transition: opacity 200ms ease;
}

/* Modal */
.modal-enter {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}

.modal-enter-active {
  opacity: 1;
  transform: scale(1) translateY(0);
  transition: all 200ms ease-out;
}
```

### Modal Exit

```css
.modal-exit {
  opacity: 1;
  transform: scale(1);
}

.modal-exit-active {
  opacity: 0;
  transform: scale(0.95);
  transition: all 150ms ease-in;
}
```

### Pixel Modal (Game Dialog)

```css
@keyframes dialog-open {
  0% {
    clip-path: inset(50% 50% 50% 50%);
  }
  100% {
    clip-path: inset(0% 0% 0% 0%);
  }
}

.pixel-modal-enter {
  animation: dialog-open 300ms steps(5) forwards;
}
```

---

## Toast Animations

### Slide Toast

```css
/* From bottom */
.toast-enter {
  transform: translateY(100%);
  opacity: 0;
}

.toast-enter-active {
  transform: translateY(0);
  opacity: 1;
  transition: all 300ms ease-out;
}

.toast-exit-active {
  transform: translateY(100%);
  opacity: 0;
  transition: all 200ms ease-in;
}
```

### Pixel Achievement Toast

```css
@keyframes pixel-toast-enter {
  0% {
    transform: translateX(-100%);
  }
  60% {
    transform: translateX(8px);
  }
  80% {
    transform: translateX(-4px);
  }
  100% {
    transform: translateX(0);
  }
}

.pixel-toast {
  animation: pixel-toast-enter 0.5s steps(5) forwards;
}
```

---

## Reduced Motion

접근성을 위한 모션 감소 설정

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  /* 필수 애니메이션만 유지 */
  .spinner {
    animation-duration: 1s !important;
  }
}
```

---

## Tailwind Animation Config

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      transitionDuration: {
        'instant': '0ms',
        'fast': '100ms',
        'normal': '200ms',
        'slow': '300ms',
        'slower': '500ms',
        'pixel': '150ms',
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'step-4': 'steps(4)',
        'step-8': 'steps(8)',
        'step-10': 'steps(10)',
      },
      animation: {
        // Modern
        'spin-slow': 'spin 2s linear infinite',
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-up': 'slideUp 300ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',

        // Pixel
        'pixel-bounce': 'pixelBounce 0.5s steps(4)',
        'pixel-shake': 'pixelShake 0.3s steps(5)',
        'pixel-blink': 'blink 1s step-end infinite',
        'pixel-typing': 'typing 2s steps(20)',

        // Rewards
        'star-burst': 'starBurst 0.6s ease-out',
        'coin-collect': 'coinCollect 0.5s ease-out forwards',
        'level-up': 'levelUp 0.5s ease-out',

        // Loading
        'shimmer': 'shimmer 1.5s infinite',
        'dot-bounce': 'dotBounce 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pixelBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '25%': { transform: 'translateY(-8px)' },
          '50%': { transform: 'translateY(0)' },
          '75%': { transform: 'translateY(-4px)' },
        },
        pixelShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-4px)' },
          '40%': { transform: 'translateX(4px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        starBurst: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '1' },
        },
        coinCollect: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-40px) scale(0.5)', opacity: '0' },
        },
        levelUp: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.3)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        dotBounce: {
          '0%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
}
```

---

## Do's and Don'ts

### Do's
- 픽셀 요소에는 step 애니메이션 사용
- 의미 있는 피드백을 주는 애니메이션
- reduced-motion 설정 존중
- 60fps 유지되는 transform/opacity 사용

### Don'ts
- 과도한 애니메이션으로 주의 분산
- 모든 곳에 bounce 효과 남발
- width/height 애니메이션 (성능 저하)
- 3초 이상의 긴 애니메이션
