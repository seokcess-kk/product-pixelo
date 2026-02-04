---
name: testing
description: 테스트 케이스 작성 및 테스트 전략 가이드. 기능 테스트, UI 테스트, 버그 리포트 작성 시 사용. qa-engineer, frontend-dev, backend-dev가 참조.
---

# Testing Guide

테스트 케이스 작성 및 테스트 전략 가이드.

## 테스트 피라미드

```
      /\
     /  \      E2E (10%)
    /----\     - 핵심 사용자 플로우
   /      \    
  /--------\   Integration (20%)
 /          \  - API, 컴포넌트 통합
/------------\ Unit (70%)
               - 함수, 유틸리티
```

## 테스트 케이스 템플릿

```markdown
# Test Cases: {기능명}

## Overview
- **기능**: {기능 이름}
- **PRD 참조**: {PRD 섹션}
- **작성일**: {날짜}

---

## TC-001: {테스트 케이스 제목}

| 항목 | 내용 |
|------|------|
| **ID** | TC-001 |
| **우선순위** | Critical / High / Medium / Low |
| **유형** | Functional / UI / Performance |
| **전제조건** | {테스트 전 필요한 상태} |

**테스트 단계**:
1. {단계 1}
2. {단계 2}
3. {단계 3}

**예상 결과**:
- {예상 결과}

**실제 결과**: 
- [ ] Pass
- [ ] Fail → BUG-XXX
```

## 테스트 유형별 커버리지

| 유형 | 설명 | 예시 |
|------|------|------|
| **Happy Path** | 정상 흐름 | 올바른 정보로 로그인 성공 |
| **Negative** | 잘못된 입력 | 틀린 비밀번호로 실패 |
| **Boundary** | 경계값 | 비밀번호 최소/최대 길이 |
| **Edge Case** | 극단적 상황 | 동시 로그인, 세션 만료 |
| **Error** | 에러 상황 | 네트워크 오류 |

## 우선순위 기준

| 우선순위 | 기준 | 예시 |
|----------|------|------|
| **Critical** | 핵심 기능, 없으면 서비스 불가 | 로그인, 결제 |
| **High** | 주요 기능, 대부분 사용자 영향 | 검색, 목록 |
| **Medium** | 보조 기능, 일부 영향 | 프로필 수정 |
| **Low** | 사소한 기능 | UI 미세 조정 |

## Unit Test (Jest/Vitest)

### 함수 테스트

```typescript
// lib/utils.test.ts
import { formatDate, validateEmail } from './utils'

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2025-01-15')
    expect(formatDate(date)).toBe('2025년 1월 15일')
  })

  it('should handle invalid date', () => {
    expect(formatDate(null)).toBe('')
  })
})

describe('validateEmail', () => {
  it('should return true for valid email', () => {
    expect(validateEmail('test@example.com')).toBe(true)
  })

  it('should return false for invalid email', () => {
    expect(validateEmail('invalid-email')).toBe(false)
    expect(validateEmail('')).toBe(false)
  })
})
```

### 훅 테스트

```typescript
// hooks/useCounter.test.ts
import { renderHook, act } from '@testing-library/react'
import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter())
    expect(result.current.count).toBe(0)
  })

  it('should increment', () => {
    const { result } = renderHook(() => useCounter())
    act(() => result.current.increment())
    expect(result.current.count).toBe(1)
  })
})
```

## Component Test (Testing Library)

```tsx
// components/LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('should render form fields', () => {
    render(<LoginForm onSuccess={jest.fn()} />)
    
    expect(screen.getByLabelText('이메일')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument()
  })

  it('should show error on invalid credentials', async () => {
    render(<LoginForm onSuccess={jest.fn()} />)
    
    fireEvent.change(screen.getByLabelText('이메일'), {
      target: { value: 'wrong@email.com' }
    })
    fireEvent.change(screen.getByLabelText('비밀번호'), {
      target: { value: 'wrongpassword' }
    })
    fireEvent.click(screen.getByRole('button', { name: '로그인' }))
    
    await waitFor(() => {
      expect(screen.getByText('이메일 또는 비밀번호가 올바르지 않습니다.')).toBeInTheDocument()
    })
  })

  it('should call onSuccess on valid login', async () => {
    const onSuccess = jest.fn()
    render(<LoginForm onSuccess={onSuccess} />)
    
    // ... 올바른 정보 입력
    
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled()
    })
  })
})
```

## API Test

```typescript
// app/api/users/route.test.ts
import { POST } from './route'
import { NextRequest } from 'next/server'

describe('POST /api/users', () => {
  it('should create user with valid data', async () => {
    const request = new NextRequest('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.data.email).toBe('test@example.com')
  })

  it('should return 400 for invalid email', async () => {
    const request = new NextRequest('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify({
        email: 'invalid',
        password: 'password123',
        name: 'Test'
      })
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })
})
```

## Bug Report 템플릿

```markdown
# BUG-{번호}: {버그 제목}

## Summary
| 항목 | 내용 |
|------|------|
| **심각도** | Critical / High / Medium / Low |
| **상태** | Open / In Progress / Fixed / Closed |
| **발견일** | {날짜} |
| **담당자** | {담당 Agent} |

## Environment
- URL: {테스트 URL}
- 브라우저: {브라우저/버전}
- OS: {운영체제}

## Steps to Reproduce
1. {재현 단계 1}
2. {재현 단계 2}
3. {재현 단계 3}

## Expected Result
{예상 결과}

## Actual Result
{실제 결과}

## Evidence
- 스크린샷: {첨부}
- 콘솔 로그: {에러 메시지}
```

## 심각도 기준

| 심각도 | 설명 | 예시 |
|--------|------|------|
| **Critical** | 서비스 불가, 데이터 손실 | 앱 크래시, 결제 오류 |
| **High** | 주요 기능 오작동 | 핵심 기능 에러 |
| **Medium** | 기능 일부 문제 | UI 깨짐 |
| **Low** | 경미한 이슈 | 오타 |

## 테스트 체크리스트

### 기능 테스트
- [ ] Happy path 통과
- [ ] 에러 케이스 처리
- [ ] 경계값 테스트
- [ ] 권한 테스트 (인증/인가)

### UI 테스트
- [ ] 디자인 일치
- [ ] 반응형 동작
- [ ] 상태 표시 (로딩/에러/빈)
- [ ] 접근성

### 회귀 테스트
- [ ] 기존 기능 영향 없음
- [ ] 핵심 플로우 정상