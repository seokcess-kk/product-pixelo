# API Specification - Social Features

PIXELO 프로젝트의 소셜 기능 API 명세서입니다.

## Base URL

```
/api/social
```

## Authentication

모든 엔드포인트는 Supabase Auth를 통한 인증이 필요합니다.
- Cookie 기반 세션 인증
- 인증되지 않은 요청은 `401 Unauthorized` 반환

---

## Endpoints

### 1. 친구 목록 조회

#### GET /api/social/friends

현재 사용자의 팔로잉/팔로워 목록을 조회합니다.

**Request**
- Headers: Supabase Auth Cookie (자동 포함)

**Response 200**
```json
{
  "data": {
    "following": [
      {
        "id": "uuid",
        "nickname": "string",
        "avatarUrl": "string | undefined",
        "bio": "string | undefined",
        "isPublic": true,
        "isMutual": true,
        "followedAt": "ISO 8601"
      }
    ],
    "followers": [
      {
        "id": "uuid",
        "nickname": "string",
        "avatarUrl": "string | undefined",
        "bio": "string | undefined",
        "isPublic": true,
        "isMutual": false,
        "followedAt": "ISO 8601"
      }
    ],
    "mutualCount": 5
  }
}
```

**Response 401** - 인증 필요
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "로그인이 필요합니다."
  }
}
```

---

### 2. 친구 추가 (팔로우)

#### POST /api/social/friends/{userId}

특정 사용자를 팔로우합니다.

**Request**
- Path Parameters:
  - `userId` (uuid, required): 팔로우할 사용자 ID

**Response 201** - 팔로우 성공
```json
{
  "data": {
    "message": "팔로우했습니다.",
    "userId": "uuid",
    "nickname": "string"
  }
}
```

**Response 200** - 기존 관계 복구 (blocked -> active)
```json
{
  "data": {
    "message": "팔로우했습니다.",
    "userId": "uuid",
    "nickname": "string"
  }
}
```

**Response 400** - 유효성 검증 실패
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "유효한 사용자 ID가 아닙니다."
  }
}
```

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "자기 자신을 팔로우할 수 없습니다."
  }
}
```

**Response 404** - 사용자 없음
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "사용자를 찾을 수 없습니다."
  }
}
```

**Response 409** - 이미 팔로우 중
```json
{
  "error": {
    "code": "ALREADY_EXISTS",
    "message": "이미 팔로우 중입니다."
  }
}
```

---

### 3. 친구 삭제 (언팔로우)

#### DELETE /api/social/friends/{userId}

특정 사용자 팔로우를 취소합니다.

**Request**
- Path Parameters:
  - `userId` (uuid, required): 언팔로우할 사용자 ID

**Response 204** - 언팔로우 성공 (No Content)

**Response 400** - 유효성 검증 실패
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "유효한 사용자 ID가 아닙니다."
  }
}
```

**Response 404** - 팔로우 관계 없음
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "팔로우 관계를 찾을 수 없습니다."
  }
}
```

---

### 4. 친구 공간 조회

#### GET /api/social/visit/{userId}

친구의 공간 정보를 조회합니다 (읽기 전용). 방문 기록이 자동으로 저장됩니다.

**Request**
- Path Parameters:
  - `userId` (uuid, required): 방문할 사용자 ID
- Query Parameters:
  - `seasonId` (uuid, optional): 특정 시즌 공간 조회. 미지정 시 현재 활성 시즌

**Response 200**
```json
{
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "seasonId": "uuid",
    "name": "string | undefined",
    "isPublic": true,
    "layout": [
      {
        "objectId": "uuid",
        "x": 100,
        "y": 200,
        "scale": 1.0,
        "rotation": 0,
        "zIndex": 1
      }
    ],
    "backgroundVariant": "string | undefined",
    "lastEditedAt": "ISO 8601 | undefined",
    "user": {
      "nickname": "string",
      "avatarUrl": "string | undefined"
    },
    "season": {
      "name": "string",
      "spaceType": "room | hideout",
      "spaceBackgroundUrl": "string | undefined"
    },
    "objects": [
      {
        "id": "uuid",
        "name": "string",
        "imageUrl": "string",
        "thumbnailUrl": "string | undefined",
        "categoryCode": "string",
        "layerOrder": 1,
        "width": 100,
        "height": 100
      }
    ]
  }
}
```

**Response 400** - 잘못된 요청
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "자신의 공간은 /api/space를 사용하세요."
  }
}
```

**Response 403** - 권한 없음
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "이 사용자의 공간을 볼 권한이 없습니다."
  }
}
```

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "이 공간은 비공개입니다."
  }
}
```

**Response 404** - 리소스 없음
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "사용자를 찾을 수 없습니다."
  }
}
```

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "공간을 찾을 수 없습니다."
  }
}
```

---

### 5. 친구 비교 데이터

#### GET /api/social/compare/{userId}

나와 친구의 7개 축 점수를 비교합니다.

**Request**
- Path Parameters:
  - `userId` (uuid, required): 비교할 사용자 ID
- Query Parameters:
  - `seasonId` (uuid, optional): 특정 시즌 점수 비교. 미지정 시 현재 활성 시즌

**Response 200**
```json
{
  "data": {
    "myScores": [
      {
        "axisId": "uuid",
        "axisCode": "energy",
        "axisName": "에너지 방향",
        "lowEndName": "내향",
        "highEndName": "외향",
        "averageScore": 3.5,
        "finalScore": 4
      }
    ],
    "friendScores": [
      {
        "axisId": "uuid",
        "axisCode": "energy",
        "axisName": "에너지 방향",
        "lowEndName": "내향",
        "highEndName": "외향",
        "averageScore": 2.8,
        "finalScore": 3
      }
    ],
    "similarities": [
      {
        "axisCode": "energy",
        "axisName": "에너지 방향",
        "scoreDifference": 1,
        "isSimilar": true
      }
    ],
    "overallSimilarity": 75,
    "friendInfo": {
      "id": "uuid",
      "nickname": "string",
      "avatarUrl": "string | undefined"
    }
  }
}
```

**Response 400** - 잘못된 요청
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "자기 자신과는 비교할 수 없습니다."
  }
}
```

**Response 403** - 권한 없음
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "이 사용자의 점수를 볼 권한이 없습니다."
  }
}
```

**Similarity Calculation**
- `scoreDifference`: 두 점수의 절대값 차이 (0-4)
- `isSimilar`: 차이가 1 이하인 경우 true
- `overallSimilarity`: (최대 가능 차이 - 실제 차이) / 최대 가능 차이 * 100
- `scoreDifference: -1`: 비교 불가 (한쪽 점수 없음)

---

### 6. 사용자 검색

#### GET /api/social/search

닉네임으로 사용자를 검색합니다. 공개 프로필만 검색됩니다.

**Request**
- Query Parameters:
  - `q` (string, required): 검색어 (1-50자)
  - `page` (number, optional, default: 1): 페이지 번호
  - `limit` (number, optional, default: 20, max: 50): 페이지당 결과 수

**Response 200**
```json
{
  "data": [
    {
      "id": "uuid",
      "nickname": "string",
      "avatarUrl": "string | undefined",
      "bio": "string | undefined",
      "isFollowing": true,
      "isFollower": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

**Response 200** - 검색 결과 없음
```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

**Response 400** - 유효성 검증 실패
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "검색어를 입력해주세요."
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | 인증 필요 |
| FORBIDDEN | 403 | 권한 없음 |
| NOT_FOUND | 404 | 리소스 없음 |
| VALIDATION_ERROR | 400 | 입력값 유효성 검증 실패 |
| INVALID_REQUEST | 400 | 잘못된 요청 |
| ALREADY_EXISTS | 409 | 이미 존재 (중복) |
| INTERNAL_ERROR | 500 | 서버 내부 오류 |

---

## Types

### FriendWithProfile
```typescript
interface FriendWithProfile {
  id: string
  nickname: string
  avatarUrl?: string
  bio?: string
  isPublic: boolean
  isMutual: boolean
  followedAt: string
}
```

### UserSearchResult
```typescript
interface UserSearchResult {
  id: string
  nickname: string
  avatarUrl?: string
  bio?: string
  isFollowing: boolean
  isFollower: boolean
}
```

### AxisScore
```typescript
interface AxisScore {
  axisId: string
  axisCode: string
  axisName: string
  lowEndName: string
  highEndName: string
  averageScore?: number
  finalScore?: number
}
```

### ComparisonData
```typescript
interface ComparisonData {
  myScores: AxisScore[]
  friendScores: AxisScore[]
  similarities: {
    axisCode: string
    axisName: string
    scoreDifference: number
    isSimilar: boolean
  }[]
  overallSimilarity: number
  friendInfo: {
    id: string
    nickname: string
    avatarUrl?: string
  }
}
```

---

## Access Control

### 프로필/공간 접근 규칙

| 대상 프로필 | 대상 공간 | 접근 조건 |
|------------|----------|----------|
| 공개 | 공개 | 누구나 |
| 공개 | 비공개 | 팔로우 관계 |
| 비공개 | - | 팔로우 관계 |

### RLS (Row Level Security)

Supabase RLS 정책에 따라 데이터 접근이 제어됩니다.
- `friendships`: 자신의 팔로우/팔로워 관계만 조회 가능
- `axis_scores`: 자신 또는 팔로우하는 사용자의 점수만 조회 가능
- `spaces`: 자신, 공개 공간, 팔로우하는 사용자의 공간만 조회 가능
