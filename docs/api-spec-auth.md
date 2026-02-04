# Authentication API Specification

PIXELO 프로젝트의 인증 관련 API 명세서입니다.

## Base URL

- 개발: `http://localhost:3000/api`
- 프로덕션: `https://{domain}/api`

## Authentication

Supabase Auth를 사용하며, 인증이 필요한 엔드포인트는 세션 쿠키를 통해 인증됩니다.

---

## OAuth Login Flow

### 1. 소셜 로그인 시작

클라이언트에서 Supabase Auth SDK를 사용하여 OAuth 로그인을 시작합니다.

```typescript
// 카카오 로그인
await supabase.auth.signInWithOAuth({
  provider: 'kakao',
  options: {
    redirectTo: `${window.location.origin}/callback`,
  },
})

// 네이버 로그인
await supabase.auth.signInWithOAuth({
  provider: 'naver',
  options: {
    redirectTo: `${window.location.origin}/callback`,
  },
})
```

### 2. OAuth 콜백 처리

**URL**: `GET /callback`

OAuth 제공자로부터 인증 코드를 받아 세션을 생성합니다.

**Query Parameters**
- `code` (string): OAuth 인증 코드
- `error` (string, optional): OAuth 에러 코드
- `error_description` (string, optional): 에러 설명

**Redirect Logic**
1. 코드 교환 성공 + 프로필 존재: `/` (메인)
2. 코드 교환 성공 + 프로필 없음: `/onboarding`
3. 에러 발생: `/login?error={error_code}`

---

## Endpoints

### GET /api/auth/me

현재 로그인한 사용자 정보 및 프로필 조회

**Authentication**: Required

**Response 200** - 기존 사용자
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "provider": "kakao",
      "createdAt": "2025-02-04T12:00:00Z"
    },
    "profile": {
      "id": "uuid",
      "userId": "uuid",
      "nickname": "닉네임",
      "avatarUrl": "https://example.com/avatar.jpg",
      "createdAt": "2025-02-04T12:00:00Z",
      "updatedAt": "2025-02-04T12:00:00Z"
    },
    "isNewUser": false
  }
}
```

**Response 200** - 신규 사용자 (프로필 없음)
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "provider": "kakao",
      "createdAt": "2025-02-04T12:00:00Z"
    },
    "profile": null,
    "isNewUser": true
  }
}
```

**Response 401**
```json
{
  "error": {
    "code": "NOT_AUTHENTICATED",
    "message": "로그인이 필요합니다."
  }
}
```

---

### POST /api/auth/logout

서버 사이드 로그아웃 처리

**Authentication**: Required

**Response 200**
```json
{
  "data": {
    "message": "로그아웃되었습니다."
  }
}
```

**Response 401**
```json
{
  "error": {
    "code": "NOT_AUTHENTICATED",
    "message": "로그인 상태가 아닙니다."
  }
}
```

**Response 500**
```json
{
  "error": {
    "code": "LOGOUT_FAILED",
    "message": "로그아웃에 실패했습니다."
  }
}
```

---

### GET /api/auth/profile

현재 사용자의 프로필 조회

**Authentication**: Required

**Response 200**
```json
{
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "nickname": "닉네임",
    "avatarUrl": "https://example.com/avatar.jpg",
    "createdAt": "2025-02-04T12:00:00Z",
    "updatedAt": "2025-02-04T12:00:00Z"
  }
}
```

**Response 401**
```json
{
  "error": {
    "code": "NOT_AUTHENTICATED",
    "message": "로그인이 필요합니다."
  }
}
```

**Response 404**
```json
{
  "error": {
    "code": "PROFILE_NOT_FOUND",
    "message": "프로필을 찾을 수 없습니다."
  }
}
```

---

### POST /api/auth/profile

새 프로필 생성 (온보딩)

**Authentication**: Required

**Request Body**
```json
{
  "nickname": "string (required, 2-20자, 한글/영문/숫자/밑줄)",
  "avatarUrl": "string (optional, URL format)"
}
```

**Validation Rules**
- `nickname`: 2-20자, 한글/영문/숫자/밑줄(_)만 허용
- `avatarUrl`: 유효한 URL 형식

**Response 201**
```json
{
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "nickname": "닉네임",
    "avatarUrl": null,
    "createdAt": "2025-02-04T12:00:00Z",
    "updatedAt": "2025-02-04T12:00:00Z"
  }
}
```

**Response 400** - 유효성 검증 실패
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "닉네임은 2자 이상이어야 합니다.",
    "details": [...]
  }
}
```

**Response 401**
```json
{
  "error": {
    "code": "NOT_AUTHENTICATED",
    "message": "로그인이 필요합니다."
  }
}
```

**Response 409** - 프로필 이미 존재
```json
{
  "error": {
    "code": "PROFILE_EXISTS",
    "message": "이미 프로필이 존재합니다."
  }
}
```

**Response 409** - 닉네임 중복
```json
{
  "error": {
    "code": "NICKNAME_DUPLICATE",
    "message": "이미 사용 중인 닉네임입니다."
  }
}
```

---

### PATCH /api/auth/profile

프로필 수정

**Authentication**: Required

**Request Body** (모든 필드 optional)
```json
{
  "nickname": "string (optional, 2-20자)",
  "avatarUrl": "string (optional, URL format)"
}
```

**Response 200**
```json
{
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "nickname": "새닉네임",
    "avatarUrl": "https://example.com/new-avatar.jpg",
    "createdAt": "2025-02-04T12:00:00Z",
    "updatedAt": "2025-02-04T13:00:00Z"
  }
}
```

**Response 400** - 유효성 검증 실패
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "닉네임은 20자 이하여야 합니다."
  }
}
```

**Response 400** - 수정할 내용 없음
```json
{
  "error": {
    "code": "NO_UPDATE_DATA",
    "message": "수정할 내용이 없습니다."
  }
}
```

**Response 401**
```json
{
  "error": {
    "code": "NOT_AUTHENTICATED",
    "message": "로그인이 필요합니다."
  }
}
```

**Response 404**
```json
{
  "error": {
    "code": "PROFILE_NOT_FOUND",
    "message": "프로필을 찾을 수 없습니다."
  }
}
```

**Response 409** - 닉네임 중복
```json
{
  "error": {
    "code": "NICKNAME_DUPLICATE",
    "message": "이미 사용 중인 닉네임입니다."
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| NOT_AUTHENTICATED | 401 | 인증되지 않은 요청 |
| VALIDATION_ERROR | 400 | 입력 유효성 검증 실패 |
| PROFILE_NOT_FOUND | 404 | 프로필을 찾을 수 없음 |
| PROFILE_EXISTS | 409 | 프로필이 이미 존재 |
| NICKNAME_DUPLICATE | 409 | 닉네임 중복 |
| NO_UPDATE_DATA | 400 | 수정할 데이터 없음 |
| LOGOUT_FAILED | 500 | 로그아웃 실패 |
| INTERNAL_ERROR | 500 | 서버 내부 오류 |

---

## Client Usage Examples

### useAuth Hook 사용

```typescript
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const {
    user,
    profile,
    isLoading,
    isAuthenticated,
    hasProfile,
    signInWithKakao,
    signInWithNaver,
    signOut,
    refreshProfile,
  } = useAuth()

  // 카카오 로그인
  const handleKakaoLogin = async () => {
    try {
      await signInWithKakao()
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  // 로그아웃
  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
}
```

### 프로필 생성 (온보딩)

```typescript
const response = await fetch('/api/auth/profile', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nickname: '새닉네임' }),
})

const result = await response.json()

if (result.error) {
  // 에러 처리
} else {
  // 성공 - result.data에 프로필 정보
}
```

---

## Protected Routes

미들웨어에서 보호되는 라우트 목록:

- `/mypage/*` - 마이페이지
- `/question/*` - 질문/답변
- `/space/*` - 공간
- `/friends/*` - 친구
- `/onboarding/*` - 온보딩

인증되지 않은 사용자가 이 라우트에 접근하면 `/login`으로 리다이렉트됩니다.

### 로그인 후 원래 페이지로 돌아가기

미들웨어가 로그인 페이지로 리다이렉트할 때 `next` 쿼리 파라미터를 추가합니다.
로그인 성공 후 콜백에서 이 파라미터를 사용하여 원래 페이지로 돌아갑니다.

```
/login?next=/mypage
```
