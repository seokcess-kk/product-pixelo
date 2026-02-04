# Documentation

## 문서 유형

### 1. PRD (Product Requirements Document)
- 위치: `/docs/prd-{feature}.md`
- 작성자: product-manager
- 목적: 기능 요구사항 정의

### 2. API 명세
- 위치: `/docs/api-{feature}.md`
- 작성자: backend-dev
- 목적: API 엔드포인트 문서화

### 3. 인프라 문서
- 위치: `/docs/infrastructure/`
- 작성자: devops
- 목적: 배포/환경 설정 문서화

### 4. 디자인 문서
- 위치: `/design/`
- 작성자: ux-designer, ui-designer
- 목적: 플로우, 와이어프레임, 디자인 시스템

## API 문서 템플릿

```markdown
# API: {기능명}

## 개요
{API 설명}

## Base URL
- Production: `https://example.com/api`
- Development: `http://localhost:3000/api`

## 인증
모든 요청에 인증 필요:
- Header: `Authorization: Bearer {token}`

---

## Endpoints

### 목록 조회
`GET /api/users`

#### Query Parameters
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| page | number | X | 페이지 번호 (기본: 1) |
| limit | number | X | 페이지당 항목 수 (기본: 20) |

#### Response
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

### 단일 조회
`GET /api/users/:id`

#### Path Parameters
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| id | string | 사용자 UUID |

#### Response
```json
{
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 생성
`POST /api/users`

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### Response (201)
```json
{
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

## 에러 응답

### 형식
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": []
  }
}
```

### 에러 코드
| 코드 | HTTP | 설명 |
|------|------|------|
| UNAUTHORIZED | 401 | 인증 필요 |
| FORBIDDEN | 403 | 권한 없음 |
| NOT_FOUND | 404 | 리소스 없음 |
| VALIDATION_ERROR | 422 | 입력값 오류 |
```

## 코드 주석 가이드

### 함수 주석
```typescript
/**
 * 사용자를 생성합니다.
 *
 * @param data - 생성할 사용자 정보
 * @returns 생성된 사용자 객체
 * @throws {ValidationError} 입력값이 유효하지 않은 경우
 *
 * @example
 * const user = await createUser({ name: 'John', email: 'john@example.com' })
 */
async function createUser(data: CreateUserInput): Promise<User> {
  // ...
}
```

### 복잡한 로직
```typescript
// 💡 왜 이렇게 했는지 설명
// 동시 요청 시 race condition 방지를 위해
// optimistic locking 패턴 사용
const updated = await updateWithVersion(id, data, version)
```

### TODO/FIXME
```typescript
// TODO: 추후 캐싱 추가 필요
// FIXME: 대용량 데이터 시 성능 이슈 있음
```

## README 구조

```markdown
# 프로젝트명

{한 줄 설명}

## 시작하기

### 요구사항
- Node.js 18+
- npm 9+

### 설치
\`\`\`bash
npm install
\`\`\`

### 실행
\`\`\`bash
npm run dev
\`\`\`

## 스크립트

| 스크립트 | 설명 |
|----------|------|
| dev | 개발 서버 실행 |
| build | 프로덕션 빌드 |
| start | 프로덕션 서버 실행 |

## 기술 스택

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase

## 폴더 구조

\`\`\`
src/
├── app/
├── components/
└── lib/
\`\`\`

## 라이선스

MIT
```
