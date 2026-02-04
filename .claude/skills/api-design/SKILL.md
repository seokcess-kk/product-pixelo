---
name: api-design
description: RESTful API 설계 및 문서화 가이드. API 엔드포인트 설계, 응답 형식 정의, API 스펙 문서 작성 시 사용. backend-dev가 참조.
---

# API Design

RESTful API 설계 및 문서화 가이드.

## RESTful 원칙

### HTTP 메서드

| Method | 용도 | 예시 | 멱등성 |
|--------|------|------|--------|
| GET | 조회 | `GET /api/users/:id` | ✅ |
| POST | 생성 | `POST /api/users` | ❌ |
| PUT | 전체 수정 | `PUT /api/users/:id` | ✅ |
| PATCH | 부분 수정 | `PATCH /api/users/:id` | ✅ |
| DELETE | 삭제 | `DELETE /api/users/:id` | ✅ |

### URL 네이밍

```bash
# ✅ Good
GET    /api/users
GET    /api/users/:id
GET    /api/users/:id/posts
POST   /api/users/:id/posts

# ❌ Bad
GET    /api/getUsers
POST   /api/createUser
GET    /api/user_posts
```

**규칙:**
- 복수형 명사 사용 (`users`, `posts`)
- 소문자 + 하이픈 (`/api/user-profiles`)
- 동사 사용 안 함 (HTTP 메서드가 동사)
- 계층 구조 표현 (`/users/:id/posts`)

## 응답 형식

### 성공 응답

```json
// 단일 리소스
{
  "data": {
    "id": "123",
    "name": "홍길동",
    "email": "hong@example.com"
  }
}

// 목록 (페이지네이션)
{
  "data": [
    { "id": "1", "name": "항목 1" },
    { "id": "2", "name": "항목 2" }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}

// 생성 성공
{
  "data": {
    "id": "new-123",
    "name": "새 항목"
  }
}
```

### 에러 응답

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "이메일 형식이 올바르지 않습니다.",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  }
}
```

## HTTP 상태 코드

### 성공 (2xx)

| 코드 | 의미 | 사용 |
|------|------|------|
| 200 | OK | GET, PUT, PATCH 성공 |
| 201 | Created | POST 생성 성공 |
| 204 | No Content | DELETE 성공 |

### 클라이언트 에러 (4xx)

| 코드 | 의미 | 사용 |
|------|------|------|
| 400 | Bad Request | 유효성 검증 실패 |
| 401 | Unauthorized | 인증 필요 |
| 403 | Forbidden | 권한 없음 |
| 404 | Not Found | 리소스 없음 |
| 409 | Conflict | 충돌 (중복 등) |
| 422 | Unprocessable | 유효하지만 처리 불가 |
| 429 | Too Many Requests | Rate limit |

### 서버 에러 (5xx)

| 코드 | 의미 | 사용 |
|------|------|------|
| 500 | Internal Server Error | 서버 오류 |
| 502 | Bad Gateway | 업스트림 오류 |
| 503 | Service Unavailable | 서비스 불가 |

## 에러 코드 표준

```typescript
// 에러 코드 정의
const ErrorCodes = {
  // 인증
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // 유효성
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // 리소스
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  
  // 서버
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const
```

## API 스펙 문서 형식

```markdown
# API Specification

## Base URL
`https://api.example.com/v1`

## Authentication
Bearer Token in Authorization header

---

## Endpoints

### Users

#### GET /users/:id
사용자 정보 조회

**Request**
- Path: `id` (string, required) - 사용자 ID
- Headers: `Authorization: Bearer {token}`

**Response 200**
```json
{
  "data": {
    "id": "string",
    "email": "string",
    "name": "string",
    "createdAt": "ISO 8601"
  }
}
```

**Response 404**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "사용자를 찾을 수 없습니다."
  }
}
```

#### POST /users
사용자 생성

**Request Body**
```json
{
  "email": "string (required, email format)",
  "password": "string (required, min 8)",
  "name": "string (required)"
}
```

**Response 201**
```json
{
  "data": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

**Response 400** - 유효성 검증 실패
**Response 409** - 이메일 중복
```

## 입력 유효성 검증

```typescript
import { z } from 'zod'

// 스키마 정의
const createUserSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
  name: z.string().min(1, '이름을 입력하세요'),
})

// 사용
const result = createUserSchema.safeParse(input)
if (!result.success) {
  return { error: { code: 'VALIDATION_ERROR', details: result.error } }
}
```

## 페이지네이션

### Offset 기반 (기본)

```bash
GET /api/users?page=1&pageSize=20
```

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Cursor 기반 (대용량)

```bash
GET /api/users?cursor=abc123&limit=20
```

```json
{
  "data": [...],
  "pagination": {
    "nextCursor": "xyz789",
    "hasMore": true
  }
}
```

## 필터링 & 정렬

```bash
# 필터링
GET /api/users?status=active&role=admin

# 정렬
GET /api/users?sort=createdAt:desc

# 검색
GET /api/users?search=홍길동

# 복합
GET /api/users?status=active&sort=name:asc&page=1
```

## 버전 관리

```bash
# URL 버전 (권장)
/api/v1/users
/api/v2/users

# 헤더 버전
Accept: application/vnd.api+json;version=1
```

## 보안 체크리스트

- [ ] 인증 필요 엔드포인트 확인
- [ ] 입력 유효성 검증
- [ ] SQL Injection 방지 (ORM/파라미터화)
- [ ] Rate limiting 적용
- [ ] 민감 정보 응답 제외
- [ ] CORS 설정
- [ ] HTTPS 강제