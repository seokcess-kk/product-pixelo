# PIXELO Typography System

> 레트로 픽셀 감성과 현대적 가독성의 조화

---

## Font Families

### Display Font (제목용) - DungGeunMo
픽셀 아트 감성의 한글 비트맵 폰트

```css
font-family: 'DungGeunMo', 'Press Start 2P', monospace;
```

- **Name**: 둥근모꼴 (DungGeunMo)
- **Source**: 무료 웹폰트 (Google Fonts 대안: 직접 호스팅)
- **License**: Public Domain / 자유 이용
- **Usage**: 히어로 제목, 게임 요소, 브랜딩 텍스트
- **Fallback**: 'Press Start 2P' (영문), monospace

#### 대안 픽셀 폰트
| Font | Language | Source | License |
|------|----------|--------|---------|
| DungGeunMo | KR/EN | NAVER | 자유이용 |
| Press Start 2P | EN | Google Fonts | OFL |
| Galmuri | KR/EN | GitHub | OFL |
| Neo둥근모 | KR/EN | GitHub | OFL |

### Body Font (본문용) - Pretendard
현대적이고 가독성 좋은 한글 폰트

```css
font-family: 'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
```

- **Name**: Pretendard
- **Source**: https://cactus.tistory.com/306
- **License**: OFL (무료)
- **Usage**: 본문, 설명, UI 텍스트
- **특징**:
  - Variable Font 지원
  - 넓은 weight 범위 (100-900)
  - 한글/영문 조화

### Mono Font (코드/숫자용) - JetBrains Mono
숫자와 코드 표시용

```css
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

- **Name**: JetBrains Mono
- **Source**: Google Fonts
- **License**: OFL
- **Usage**: 점수, 코드, 숫자 강조

---

## Type Scale

### Display (픽셀 폰트)
히어로 섹션, 게임 UI, 브랜딩에 사용

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| pixel-hero | 48px | 1.2 | 400 | 메인 히어로 |
| pixel-title | 32px | 1.3 | 400 | 페이지 제목 |
| pixel-heading | 24px | 1.4 | 400 | 섹션 제목 |
| pixel-subhead | 20px | 1.4 | 400 | 서브 제목 |
| pixel-body | 16px | 1.5 | 400 | 픽셀 본문 |
| pixel-caption | 12px | 1.4 | 400 | 작은 라벨 |

> **Note**: 픽셀 폰트는 특정 배수 크기에서 선명하게 렌더링됨
> 권장 크기: 8, 12, 16, 20, 24, 32, 48 (8의 배수)

### Modern (Pretendard)
일반 UI, 본문, 설명에 사용

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| display-lg | 48px | 1.1 | 700 | 히어로 (현대적) |
| display-md | 36px | 1.2 | 700 | 페이지 제목 |
| display-sm | 30px | 1.2 | 600 | 섹션 제목 |
| heading-lg | 24px | 1.3 | 600 | 카드 제목 |
| heading-md | 20px | 1.4 | 600 | 서브 제목 |
| heading-sm | 18px | 1.4 | 600 | 작은 제목 |
| body-lg | 18px | 1.6 | 400 | 큰 본문 |
| body-md | 16px | 1.6 | 400 | **기본 본문** |
| body-sm | 14px | 1.5 | 400 | 작은 본문 |
| caption | 12px | 1.4 | 400 | 라벨, 힌트 |
| tiny | 10px | 1.3 | 400 | 법적 고지 |

### Number (JetBrains Mono)
점수, 통계, 시간 표시

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| number-hero | 64px | 1.0 | 700 | 메인 점수 |
| number-lg | 48px | 1.1 | 700 | 큰 숫자 |
| number-md | 32px | 1.2 | 600 | 중간 숫자 |
| number-sm | 24px | 1.3 | 500 | 작은 숫자 |
| number-caption | 16px | 1.4 | 400 | 통계 수치 |

---

## Font Weights

| Token | Value | Font | Usage |
|-------|-------|------|-------|
| thin | 100 | Pretendard | - |
| light | 300 | Pretendard | 서브텍스트 |
| regular | 400 | All | **기본** |
| medium | 500 | Pretendard | 강조 본문 |
| semibold | 600 | Pretendard | 제목 |
| bold | 700 | Pretendard | 강조 제목 |
| extrabold | 800 | Pretendard | 히어로 |
| black | 900 | Pretendard | 특수 강조 |

---

## Letter Spacing

| Token | Value | Usage |
|-------|-------|-------|
| tighter | -0.05em | 큰 제목 |
| tight | -0.025em | 제목 |
| normal | 0 | **기본** |
| wide | 0.025em | 버튼, 라벨 |
| wider | 0.05em | 대문자 텍스트 |
| widest | 0.1em | 특수 강조 |

---

## Text Colors

타이포그래피에서 사용하는 컬러 토큰

| Token | Hex | Usage |
|-------|-----|-------|
| text-primary | #212121 | 주요 텍스트 |
| text-secondary | #616161 | 보조 텍스트 |
| text-tertiary | #9E9E9E | 힌트, 플레이스홀더 |
| text-disabled | #BDBDBD | 비활성 |
| text-inverse | #FFFFFF | 어두운 배경 위 |
| text-link | #4D6FFF | 링크 |
| text-link-hover | #3B54DB | 링크 호버 |

### Dark Mode Text Colors
| Token | Hex | Usage |
|-------|-----|-------|
| text-primary | #F5F5F5 | 주요 텍스트 |
| text-secondary | #BDBDBD | 보조 텍스트 |
| text-tertiary | #757575 | 힌트 |

---

## Usage Guidelines

### 폰트 조합 규칙

#### 페이지 제목
```
[픽셀 폰트] 제목
[Pretendard] 부제목 또는 설명
```

#### 결과 카드
```
[픽셀 폰트] 캐릭터 이름 / 타입명
[Pretendard] 상세 설명
[JetBrains Mono] 점수 / 수치
```

#### 일반 콘텐츠
```
[Pretendard] 모든 텍스트
[JetBrains Mono] 숫자 강조시에만
```

### 픽셀 폰트 사용 시 주의사항

1. **크기 제한**: 8의 배수 크기 사용 권장 (12, 16, 24, 32, 48)
2. **안티앨리어싱**:
   ```css
   /* 픽셀 느낌 유지 */
   -webkit-font-smoothing: none;
   -moz-osx-font-smoothing: unset;
   image-rendering: pixelated;
   ```
3. **긴 본문 지양**: 가독성을 위해 짧은 텍스트에만 사용
4. **Fallback 필수**: 폰트 로딩 실패 대비

### 반응형 타이포그래피

```css
/* Mobile First */
.hero-title {
  font-size: 32px; /* mobile */
}

@media (min-width: 768px) {
  .hero-title {
    font-size: 48px; /* tablet+ */
  }
}

@media (min-width: 1024px) {
  .hero-title {
    font-size: 64px; /* desktop */
  }
}
```

| Breakpoint | pixel-hero | display-lg | body-md |
|------------|------------|------------|---------|
| Mobile (<768px) | 32px | 32px | 16px |
| Tablet (768px+) | 40px | 40px | 16px |
| Desktop (1024px+) | 48px | 48px | 16px |

---

## Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        pixel: ['DungGeunMo', 'Press Start 2P', 'monospace'],
        sans: ['Pretendard Variable', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        // Pixel Scale
        'pixel-hero': ['48px', { lineHeight: '1.2' }],
        'pixel-title': ['32px', { lineHeight: '1.3' }],
        'pixel-heading': ['24px', { lineHeight: '1.4' }],
        'pixel-subhead': ['20px', { lineHeight: '1.4' }],
        'pixel-body': ['16px', { lineHeight: '1.5' }],
        'pixel-caption': ['12px', { lineHeight: '1.4' }],

        // Modern Scale
        'display-lg': ['48px', { lineHeight: '1.1', fontWeight: '700' }],
        'display-md': ['36px', { lineHeight: '1.2', fontWeight: '700' }],
        'display-sm': ['30px', { lineHeight: '1.2', fontWeight: '600' }],
        'heading-lg': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-md': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-sm': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.6' }],
        'body-md': ['16px', { lineHeight: '1.6' }],
        'body-sm': ['14px', { lineHeight: '1.5' }],
        'caption': ['12px', { lineHeight: '1.4' }],
        'tiny': ['10px', { lineHeight: '1.3' }],

        // Number Scale
        'number-hero': ['64px', { lineHeight: '1.0', fontWeight: '700' }],
        'number-lg': ['48px', { lineHeight: '1.1', fontWeight: '700' }],
        'number-md': ['32px', { lineHeight: '1.2', fontWeight: '600' }],
        'number-sm': ['24px', { lineHeight: '1.3', fontWeight: '500' }],
      },
    },
  },
}
```

---

## Font Loading Strategy

### Preload Critical Fonts
```html
<head>
  <!-- Pretendard (Critical) -->
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
  <link rel="preload" as="font" type="font/woff2"
        href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/woff2/Pretendard-Regular.woff2"
        crossorigin />

  <!-- DungGeunMo (Display) -->
  <link rel="preload" as="font" type="font/woff2"
        href="/fonts/DungGeunMo.woff2"
        crossorigin />
</head>
```

### Font Display Strategy
```css
@font-face {
  font-family: 'Pretendard';
  src: url('/fonts/Pretendard-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap; /* 텍스트 먼저 표시 */
}

@font-face {
  font-family: 'DungGeunMo';
  src: url('/fonts/DungGeunMo.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: optional; /* 픽셀 폰트는 로딩되면 표시 */
}
```

---

## Do's and Don'ts

### Do's
- 제목에 픽셀 폰트, 본문에 현대 폰트 조합
- 숫자 강조시 Mono 폰트 사용
- 가독성이 중요한 곳은 Pretendard 사용
- 반응형 크기 적용

### Don'ts
- 긴 본문에 픽셀 폰트 사용
- 픽셀 폰트 크기를 임의로 지정 (8배수 권장)
- 한 화면에 3개 이상 폰트 혼용
- 너무 작은 픽셀 폰트 (12px 미만)
