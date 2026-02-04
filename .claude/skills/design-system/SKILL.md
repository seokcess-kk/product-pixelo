---
name: design-system
description: 디자인 시스템 구축 및 관리 가이드. 컬러, 타이포그래피, 간격, 컴포넌트 정의 시 사용. ui-designer, frontend-dev가 참조.
---

# Design System

디자인 시스템 구축 및 관리를 위한 가이드.

## 디자인 토큰

디자인 시스템의 기본 단위. 일관성 유지의 핵심.

### 컬러 토큰

```markdown
## 컬러 정의 형식

### Primary
| Token | Value | Usage |
|-------|-------|-------|
| primary-50 | {값} | 배경 (밝은) |
| primary-100 | {값} | 배경 |
| primary-500 | {값} | **기본** |
| primary-600 | {값} | Hover |
| primary-700 | {값} | Active |

### Neutral (Gray)
| Token | Value | Usage |
|-------|-------|-------|
| gray-50 | {값} | 페이지 배경 |
| gray-200 | {값} | Border |
| gray-500 | {값} | 보조 텍스트 |
| gray-900 | {값} | 본문 텍스트 |

### Semantic
| Token | Value | Usage |
|-------|-------|-------|
| success | {값} | 성공 |
| warning | {값} | 경고 |
| error | {값} | 에러 |
| info | {값} | 정보 |
```

### 타이포그래피 토큰

```markdown
## 타입 스케일

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| display-lg | 48px | 1.1 | 700 | 히어로 제목 |
| display-md | 36px | 1.2 | 700 | 페이지 제목 |
| heading-lg | 24px | 1.3 | 600 | 카드 제목 |
| heading-md | 20px | 1.4 | 600 | 서브 제목 |
| body-lg | 18px | 1.6 | 400 | 큰 본문 |
| body-md | 16px | 1.6 | 400 | **기본 본문** |
| body-sm | 14px | 1.5 | 400 | 작은 본문 |
| caption | 12px | 1.4 | 400 | 라벨, 힌트 |
```

### 간격 토큰

```markdown
## Spacing Scale (Base: 4px)

| Token | Value | Usage |
|-------|-------|-------|
| space-1 | 4px | 아이콘-텍스트 사이 |
| space-2 | 8px | 관련 요소 간격 |
| space-3 | 12px | 폼 필드 간격 |
| space-4 | 16px | **기본 간격** |
| space-6 | 24px | 섹션 내 간격 |
| space-8 | 32px | 섹션 간 간격 |
| space-12 | 48px | 페이지 섹션 |
| space-16 | 64px | 주요 섹션 구분 |
```

### 기타 토큰

```markdown
## Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| radius-sm | 4px | 작은 요소 |
| radius-md | 8px | **기본** |
| radius-lg | 12px | 카드 |
| radius-full | 9999px | 원형 |

## Shadow
| Token | Value | Usage |
|-------|-------|-------|
| shadow-sm | 0 1px 2px rgba(0,0,0,0.05) | 미묘한 강조 |
| shadow-md | 0 4px 6px rgba(0,0,0,0.1) | 카드 |
| shadow-lg | 0 10px 15px rgba(0,0,0,0.1) | 모달 |

## Transition
| Token | Value | Usage |
|-------|-------|-------|
| duration-fast | 150ms | 빠른 피드백 |
| duration-normal | 200ms | **기본** |
| duration-slow | 300ms | 큰 변화 |
| easing-default | ease | 기본 이징 |
```

## Tailwind Config 통합

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          // ...
          500: 'var(--color-primary-500)',
          // ...
        },
      },
      spacing: {
        'container': 'var(--space-container)',
        'card-gap': 'var(--space-card-gap)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius-md)',
      },
      transitionDuration: {
        DEFAULT: 'var(--duration-normal)',
      },
    },
  },
}
```

## 컴포넌트 명세 형식

### 버튼 예시

```markdown
# Button Component

## Variants
| Variant | Background | Text | Border | Hover |
|---------|------------|------|--------|-------|
| primary | primary-500 | white | none | primary-600 |
| secondary | white | gray-700 | gray-300 | gray-50 |
| ghost | transparent | gray-700 | none | gray-100 |
| destructive | error | white | none | error-600 |

## Sizes
| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| sm | 32px | 8px 12px | 14px |
| md | 40px | 10px 16px | 14px |
| lg | 48px | 12px 20px | 16px |

## States
- Default: 기본 상태
- Hover: 마우스 오버
- Focus: outline 2px primary-500, offset 2px
- Active: 클릭 중
- Disabled: opacity 0.5, cursor not-allowed
- Loading: 스피너 표시
```

## 접근성 기준

### 컬러 대비

| 용도 | 최소 대비율 | WCAG |
|------|-------------|------|
| 일반 텍스트 | 4.5:1 | AA |
| 큰 텍스트 (18px+) | 3:1 | AA |
| 권장 | 7:1 | AAA |

### Focus 스타일

```css
/* 모든 인터랙티브 요소 */
:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

## 디자인 시스템 문서 구조

```
design/
├── system/
│   ├── colors.md           # 컬러 팔레트
│   ├── typography.md       # 타이포그래피
│   ├── spacing.md          # 간격 시스템
│   ├── shadows.md          # 그림자
│   └── tokens.css          # CSS 변수
│
├── components/
│   ├── buttons.md
│   ├── inputs.md
│   ├── cards.md
│   └── ...
│
└── references/
    ├── references.md       # 레퍼런스 서비스
    ├── style-tokens.md     # 스타일 토큰 시트
    └── screenshots/        # 레퍼런스 스크린샷
```

## 레퍼런스 기반 토큰 번역

레퍼런스의 "느낌"을 구체적 수치로 변환:

```markdown
## 레퍼런스 → 토큰 번역 예시

### "미니멀한 느낌" (Notion 스타일)
- spacing scale: × 1.5 (여백 많음)
- font-weight: 400-500 (가벼움)
- border-radius: 6-8px (적당히 둥근)
- shadow: none 또는 매우 연함
- hover: 배경색 변화만 (미묘)

### "활기찬 느낌" (Duolingo 스타일)
- primary: 밝은 컬러 (Green/Orange)
- border-radius: 12-16px (많이 둥근)
- shadow: 뚜렷한 그림자
- hover: scale 또는 bounce
- 아이콘 활용 많음
```