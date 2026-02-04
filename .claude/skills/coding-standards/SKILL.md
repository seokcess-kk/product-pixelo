---
name: coding-standards
description: TypeScript/React/Next.js 코딩 표준 및 컨벤션. 코드 작성, 리뷰, 리팩토링 시 사용. frontend-dev, backend-dev, reviewer가 참조.
---

# Coding Standards

프로젝트 전반의 코딩 표준 및 컨벤션 가이드.

## TypeScript 컨벤션

### 타입 정의

```typescript
// ✅ Good - interface for objects
interface User {
  id: string
  name: string
  email: string
  createdAt: Date
}

// ✅ Good - type for unions, intersections
type Status = 'pending' | 'active' | 'inactive'
type UserWithRole = User & { role: Role }

// ❌ Bad - any 사용
const data: any = fetchData()

// ✅ Good - unknown 사용 후 타입 가드
const data: unknown = fetchData()
if (isUser(data)) {
  // data is User
}
```

### 네이밍 컨벤션

| 종류 | 컨벤션 | 예시 |
|------|--------|------|
| 변수/함수 | camelCase | `userName`, `getUserById` |
| 상수 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 타입/인터페이스 | PascalCase | `UserProfile`, `ApiResponse` |
| 컴포넌트 | PascalCase | `LoginForm`, `UserCard` |
| 파일 (컴포넌트) | PascalCase.tsx | `LoginForm.tsx` |
| 파일 (유틸) | camelCase.ts | `formatDate.ts` |
| 폴더 | kebab-case | `user-profile/` |

### Null/Undefined 처리

```typescript
// ✅ Good - optional chaining
const name = user?.profile?.name

// ✅ Good - nullish coalescing
const displayName = user.name ?? 'Anonymous'

// ✅ Good - early return
function processUser(user: User | null) {
  if (!user) return null
  // user is User here
}

// ❌ Bad - truthy check for potentially falsy values
if (count) { } // 0 is falsy but valid
// ✅ Good
if (count !== undefined) { }
```

## React 컨벤션

### 컴포넌트 구조

```tsx
// 1. imports (외부 → 내부 순서)
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

// 2. types
interface Props {
  userId: string
  onSuccess?: () => void
}

// 3. component
export function UserProfile({ userId, onSuccess }: Props) {
  // 3a. hooks
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 3b. effects
  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setIsLoading(false))
  }, [userId])

  // 3c. handlers
  const handleEdit = () => {
    router.push(`/users/${userId}/edit`)
  }

  // 3d. early returns
  if (isLoading) return <Skeleton />
  if (!user) return <NotFound />

  // 3e. render
  return (
    <div>
      <h1>{user.name}</h1>
      <Button onClick={handleEdit}>Edit</Button>
    </div>
  )
}
```

### Hook 규칙

```typescript
// ✅ Good - 커스텀 훅으로 로직 분리
function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setIsLoading(true)
    fetchUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [userId])

  return { user, isLoading, error }
}

// 컴포넌트에서 사용
function UserProfile({ userId }: { userId: string }) {
  const { user, isLoading, error } = useUser(userId)
  // ...
}
```

### 조건부 렌더링

```tsx
// ✅ Good - && 연산자 (boolean만)
{isLoggedIn && <UserMenu />}
{error && <ErrorMessage error={error} />}

// ⚠️ 주의 - 숫자는 && 사용 시 0이 렌더링됨
{count && <Badge count={count} />}  // count가 0이면 "0" 렌더링
{count > 0 && <Badge count={count} />}  // ✅ Good

// ✅ Good - 삼항 연산자 (둘 중 하나)
{isLoading ? <Spinner /> : <Content />}

// ✅ Good - early return (복잡한 조건)
if (isLoading) return <Spinner />
if (error) return <Error />
return <Content />
```

## 금지 패턴 (Anti-patterns)

### TypeScript

```typescript
// ❌ any 사용
const data: any = response.data

// ❌ 타입 단언 남용
const user = data as User // 검증 없이

// ❌ non-null assertion 남용
const name = user!.name

// ❌ enum 사용 (const object 권장)
enum Status { Active, Inactive }
// ✅ Good
const Status = { Active: 'active', Inactive: 'inactive' } as const
```

### React

```typescript
// ❌ useEffect 남용
useEffect(() => {
  setFullName(firstName + ' ' + lastName)
}, [firstName, lastName])
// ✅ Good - 계산된 값은 그냥 계산
const fullName = firstName + ' ' + lastName

// ❌ 인라인 객체/함수 (불필요한 리렌더링)
<Component style={{ color: 'red' }} onClick={() => handleClick(id)} />
// ✅ Good
const style = useMemo(() => ({ color: 'red' }), [])
const handleItemClick = useCallback(() => handleClick(id), [id])

// ❌ 인덱스를 key로 사용 (리스트가 변경될 때)
{items.map((item, index) => <Item key={index} />)}
// ✅ Good
{items.map(item => <Item key={item.id} />)}
```

## 파일 구조

### Next.js App Router

```
src/
├── app/                      # 페이지 (App Router)
│   ├── layout.tsx            # 루트 레이아웃
│   ├── page.tsx              # 홈페이지
│   ├── (auth)/               # 그룹 (URL에 미포함)
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   └── dashboard/
│       ├── page.tsx
│       └── settings/page.tsx
│
├── components/
│   ├── ui/                   # 기본 UI (shadcn)
│   ├── common/               # 공통 컴포넌트
│   └── features/             # 기능별 컴포넌트
│       └── user/
│           ├── UserCard.tsx
│           └── UserList.tsx
│
├── hooks/                    # 커스텀 훅
│   └── useUser.ts
│
├── lib/                      # 유틸리티
│   ├── utils.ts
│   └── api.ts
│
├── types/                    # 타입 정의
│   └── user.ts
│
└── styles/                   # 글로벌 스타일
    └── globals.css
```

## 참조 파일

복잡한 패턴은 별도 파일 참조:
- React 패턴 상세: [references/react-patterns.md](references/react-patterns.md)
- 에러 핸들링: [references/error-handling.md](references/error-handling.md)