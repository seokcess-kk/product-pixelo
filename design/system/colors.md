# PIXELO Color System

> "픽셀로 만나는 나의 세계"

## Design Direction

- **컨셉**: 레트로 픽셀 아트 + 현대적 감성
- **톤앤매너**: 밝고, 친근하고, 플레이풀
- **타겟**: MZ세대 (10대~30대)
- **핵심 키워드**: 레트로, 활기, 개성

---

## Primary Colors

픽셀 아트의 선명하고 깔끔한 색감을 현대적으로 재해석

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| primary-50 | #F0F4FF | 240, 244, 255 | 배경 (매우 밝은) |
| primary-100 | #DFE7FF | 223, 231, 255 | 배경 |
| primary-200 | #C4D4FF | 196, 212, 255 | 보조 요소 |
| primary-300 | #9BB5FF | 155, 181, 255 | 아이콘 (밝은) |
| primary-400 | #6B8CFF | 107, 140, 255 | 아이콘 |
| primary-500 | #4D6FFF | 77, 111, 255 | **기본 (Main)** |
| primary-600 | #3B54DB | 59, 84, 219 | Hover |
| primary-700 | #2E41B8 | 46, 65, 184 | Active |
| primary-800 | #243094 | 36, 48, 148 | 텍스트 (강조) |
| primary-900 | #1C2570 | 28, 37, 112 | 텍스트 (진한) |

### Primary 선정 이유
- 레트로 게임의 클래식한 블루 계열
- 신뢰감과 동시에 플레이풀한 느낌
- 다양한 테마 컬러와 잘 어울림

---

## 7개 측정축 테마 컬러

각 측정축을 대표하는 테마 컬러. 픽셀 아트 친화적인 선명한 색상 선택.

### 1. 에너지 방향 (Energy) - Coral Red
내향과 외향의 에너지 스펙트럼

| Token | Hex | Usage |
|-------|-----|-------|
| energy-light | #FFE5E5 | 배경 |
| energy-main | #FF6B6B | **기본** |
| energy-dark | #D63031 | 강조 |

### 2. 생활 패턴 (Lifestyle) - Amber Orange
루틴과 즉흥의 생활 방식

| Token | Hex | Usage |
|-------|-----|-------|
| lifestyle-light | #FFF3E0 | 배경 |
| lifestyle-main | #FFB347 | **기본** |
| lifestyle-dark | #E67E22 | 강조 |

### 3. 감성 스타일 (Emotion) - Rose Pink
이성과 감성의 처리 방식

| Token | Hex | Usage |
|-------|-----|-------|
| emotion-light | #FFF0F5 | 배경 |
| emotion-main | #FF85A2 | **기본** |
| emotion-dark | #E84393 | 강조 |

### 4. 미적 취향 (Aesthetic) - Mint Green
미니멀과 맥시멀의 취향

| Token | Hex | Usage |
|-------|-----|-------|
| aesthetic-light | #E8FFF5 | 배경 |
| aesthetic-main | #55EFC4 | **기본** |
| aesthetic-dark | #00B894 | 강조 |

### 5. 사회적 성향 (Social) - Sky Cyan
개인과 협력의 성향

| Token | Hex | Usage |
|-------|-----|-------|
| social-light | #E8F8FF | 배경 |
| social-main | #74B9FF | **기본** |
| social-dark | #0984E3 | 강조 |

### 6. 도전 성향 (Challenge) - Electric Purple
안정과 모험의 성향

| Token | Hex | Usage |
|-------|-----|-------|
| challenge-light | #F3E8FF | 배경 |
| challenge-main | #A855F7 | **기본** |
| challenge-dark | #7C3AED | 강조 |

### 7. 관계 방식 (Relationship) - Warm Yellow
깊은 관계와 넓은 관계

| Token | Hex | Usage |
|-------|-----|-------|
| relation-light | #FFFDE8 | 배경 |
| relation-main | #FDCB6E | **기본** |
| relation-dark | #F39C12 | 강조 |

### 축 컬러 조합 차트

```
에너지       생활패턴      감성         미적취향
[FF6B6B]    [FFB347]    [FF85A2]    [55EFC4]
  Coral      Amber       Rose        Mint

사회적       도전성향      관계방식
[74B9FF]    [A855F7]    [FDCB6E]
  Sky       Purple      Yellow
```

---

## Neutral Colors (Gray Scale)

픽셀 아트와 조화로운 따뜻한 톤의 Gray

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| gray-50 | #FAFAFA | 250, 250, 250 | 페이지 배경 |
| gray-100 | #F5F5F5 | 245, 245, 245 | 카드 배경 |
| gray-200 | #EEEEEE | 238, 238, 238 | Border (연한) |
| gray-300 | #E0E0E0 | 224, 224, 224 | Border |
| gray-400 | #BDBDBD | 189, 189, 189 | Placeholder |
| gray-500 | #9E9E9E | 158, 158, 158 | 보조 텍스트 |
| gray-600 | #757575 | 117, 117, 117 | 캡션 |
| gray-700 | #616161 | 97, 97, 97 | 본문 텍스트 |
| gray-800 | #424242 | 66, 66, 66 | 제목 텍스트 |
| gray-900 | #212121 | 33, 33, 33 | 강조 텍스트 |

---

## Semantic Colors

상태를 나타내는 시스템 컬러

### Success (성공)
| Token | Hex | Usage |
|-------|-----|-------|
| success-light | #E8F5E9 | 배경 |
| success-main | #4CAF50 | **기본** |
| success-dark | #2E7D32 | 강조 |

### Warning (경고)
| Token | Hex | Usage |
|-------|-----|-------|
| warning-light | #FFF8E1 | 배경 |
| warning-main | #FF9800 | **기본** |
| warning-dark | #E65100 | 강조 |

### Error (에러)
| Token | Hex | Usage |
|-------|-----|-------|
| error-light | #FFEBEE | 배경 |
| error-main | #F44336 | **기본** |
| error-dark | #C62828 | 강조 |

### Info (정보)
| Token | Hex | Usage |
|-------|-----|-------|
| info-light | #E3F2FD | 배경 |
| info-main | #2196F3 | **기본** |
| info-dark | #1565C0 | 강조 |

---

## Seasonal Theme Colors

시즌별/이벤트별 테마 컬러 (확장용)

### Spring (봄)
| Token | Hex | Concept |
|-------|-----|---------|
| spring-primary | #FFB7C5 | 벚꽃 핑크 |
| spring-secondary | #98D8AA | 새싹 그린 |
| spring-accent | #FFFACD | 봄햇살 |

### Summer (여름)
| Token | Hex | Concept |
|-------|-----|---------|
| summer-primary | #00CED1 | 바다 시안 |
| summer-secondary | #FFD700 | 태양 골드 |
| summer-accent | #FF6347 | 수박 레드 |

### Autumn (가을)
| Token | Hex | Concept |
|-------|-----|---------|
| autumn-primary | #D2691E | 단풍 오렌지 |
| autumn-secondary | #8B4513 | 나무 브라운 |
| autumn-accent | #DAA520 | 은행 골드 |

### Winter (겨울)
| Token | Hex | Concept |
|-------|-----|---------|
| winter-primary | #87CEEB | 눈 하늘 |
| winter-secondary | #FFFFFF | 스노우 화이트 |
| winter-accent | #DC143C | 크리스마스 레드 |

---

## Special Colors (픽셀 아트 전용)

레트로 게임 감성의 특수 컬러

| Token | Hex | Usage |
|-------|-----|-------|
| pixel-black | #1A1A2E | 픽셀 외곽선 |
| pixel-white | #FFFEF0 | 픽셀 하이라이트 |
| pixel-gold | #FFD93D | 코인/보상 |
| pixel-silver | #C0C0C0 | 보조 보상 |
| pixel-heart | #FF4757 | 하트/좋아요 |
| pixel-star | #FFC312 | 별/평점 |
| pixel-exp | #6C5CE7 | 경험치 |
| pixel-level | #00D2D3 | 레벨 |

---

## Dark Mode Colors

다크 모드 매핑

| Light Mode | Dark Mode | Usage |
|------------|-----------|-------|
| gray-50 | #1A1A2E | 배경 |
| gray-100 | #232342 | 카드 배경 |
| gray-200 | #2D2D52 | Border |
| white | #0F0F1A | 표면 |
| gray-900 | #F5F5F5 | 텍스트 |
| primary-500 | #6B8CFF | Primary (밝게) |

### Dark Mode Axis Colors
| Axis | Dark Mode Color |
|------|-----------------|
| energy | #FF8A8A |
| lifestyle | #FFCC7D |
| emotion | #FFA5B8 |
| aesthetic | #7FFFD4 |
| social | #99CCFF |
| challenge | #C084FC |
| relation | #FFE066 |

---

## Accessibility

### Color Contrast Ratios

모든 텍스트 컬러 조합은 WCAG AA 기준 충족

| Combination | Contrast | WCAG |
|-------------|----------|------|
| gray-900 on white | 16.1:1 | AAA |
| gray-800 on white | 10.4:1 | AAA |
| gray-700 on white | 6.9:1 | AA |
| primary-500 on white | 4.6:1 | AA |
| primary-700 on white | 7.2:1 | AAA |
| white on primary-500 | 4.6:1 | AA |

### Color Blindness Consideration

- 축 컬러는 색상만으로 구분하지 않고 아이콘/레이블 함께 사용
- 에러/성공 표시 시 아이콘 필수 동반
- 차트에서 패턴/텍스처 활용

---

## Usage Guidelines

### Do's
- Primary는 주요 액션 버튼에만 사용
- 축 컬러는 해당 측정 결과 표시에만 사용
- Semantic 컬러는 상태 표시에만 사용
- 한 화면에 축 컬러 2-3개까지만 조합

### Don'ts
- 축 컬러를 기본 UI 컬러로 사용하지 않기
- 시맨틱 컬러를 장식용으로 사용하지 않기
- Gray-400 이상을 본문 텍스트에 사용하지 않기
- 컬러만으로 정보 구분하지 않기
