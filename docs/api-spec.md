# PIXELO API Specification

**Version**: 1.0
**Last Updated**: 2026-02-04
**Author**: backend-dev

---

## Base URL

- Development: `http://localhost:3000/api`
- Production: `https://pixelo.app/api`

## Authentication

Supabase Auth를 통한 JWT 인증
- Header: `Authorization: Bearer {access_token}`
- Cookie: Supabase 세션 쿠키 (SSR)

---

## Endpoints

### 1. Score (점수 계산)

#### POST /api/scores/calculate

응답 데이터를 기반으로 축 점수를 계산합니다.

**Request**

```typescript
// Headers
Authorization: Bearer {token}
Content-Type: application/json

// Body
{
  "answers": [
    {
      "questionId": "string (uuid)",
      "choiceId": "string (uuid)",
      "axisCode": "energy" | "lifestyle" | "emotion" | "aesthetic" | "social" | "challenge" | "relationship",
      "scoreValue": 1-5
    }
  ]
}
```

**Response 200**

```json
{
  "data": {
    "scores": {
      "energy": {
        "axisCode": "energy",
        "totalScore": 12,
        "answerCount": 3,
        "averageScore": 4.0,
        "finalScore": 4
      },
      "lifestyle": {
        "axisCode": "lifestyle",
        "totalScore": 8,
        "answerCount": 3,
        "averageScore": 2.67,
        "finalScore": 3
      }
      // ... 다른 축들
    },
    "totalAnswers": 21,
    "completedAxes": 7
  }
}
```

**Response 400** - 유효성 검증 실패

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "유효하지 않은 축 코드입니다.",
    "details": {
      "field": "axisCode",
      "value": "invalid"
    }
  }
}
```

---

#### GET /api/scores/me

현재 사용자의 축 점수를 조회합니다.

**Request**

```
Authorization: Bearer {token}
```

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| seasonId | uuid | No | 특정 시즌 점수만 조회 |

**Response 200**

```json
{
  "data": {
    "userId": "uuid",
    "seasonId": "uuid",
    "scores": [
      {
        "axisId": "uuid",
        "axisCode": "energy",
        "axisName": "에너지 방향",
        "lowEndName": "내향",
        "highEndName": "외향",
        "totalScore": 45,
        "answerCount": 12,
        "averageScore": 3.75,
        "finalScore": 4
      }
      // ... 다른 축들
    ],
    "metadata": {
      "energy": {
        "name": "에너지 방향",
        "lowEnd": "내향",
        "highEnd": "외향"
      }
      // ...
    }
  }
}
```

---

#### GET /api/scores/radar-chart

레이더 차트용 점수 데이터를 조회합니다.

**Request**

```
Authorization: Bearer {token}
```

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| seasonId | uuid | No | 특정 시즌 점수만 조회 |
| friendId | uuid | No | 친구와 비교 시 친구 ID |

**Response 200**

```json
{
  "data": {
    "myData": [
      {
        "axis": "에너지 방향",
        "axisCode": "energy",
        "score": 3.75,
        "percentage": 68.75,
        "lowEnd": "내향",
        "highEnd": "외향"
      }
      // ... 7개 축
    ],
    "friendData": null,  // 또는 친구 데이터
    "similarity": null   // 또는 유사도 (0-100)
  }
}
```

---

### 2. Objects (오브젝트)

#### GET /api/objects

시즌별 전체 오브젝트 목록을 조회합니다.

**Request**

```
Authorization: Bearer {token}
```

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| seasonId | uuid | Yes | 시즌 ID |
| axisCode | string | No | 특정 축 오브젝트만 조회 |
| acquisitionType | string | No | axis_score, day, default |

**Response 200**

```json
{
  "data": [
    {
      "id": "uuid",
      "seasonId": "uuid",
      "categoryId": "uuid",
      "name": "아늑한 침대",
      "description": "편안한 휴식을 위한 침대",
      "imageUrl": "/objects/bed-cozy.png",
      "thumbnailUrl": "/objects/thumb/bed-cozy.png",
      "axisId": "uuid",
      "axisCode": "energy",
      "minScore": 1,
      "maxScore": 2,
      "defaultX": 5,
      "defaultY": 5,
      "width": 64,
      "height": 64,
      "isMovable": true,
      "isResizable": false,
      "acquisitionType": "axis_score",
      "acquisitionDay": null,
      "category": {
        "code": "furniture",
        "name": "가구",
        "layerOrder": 2
      }
    }
  ]
}
```

---

#### GET /api/objects/acquirable

현재 점수 기반 획득 가능한 오브젝트 목록을 조회합니다.

**Request**

```
Authorization: Bearer {token}
```

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| seasonId | uuid | Yes | 시즌 ID |

**Response 200**

```json
{
  "data": {
    "acquirable": [
      {
        "object": { /* PixelObject */ },
        "reason": "axis_energy_4"
      }
    ],
    "acquired": [
      {
        "id": "uuid",
        "objectId": "uuid",
        "object": { /* PixelObject */ },
        "acquiredAt": "2026-02-04T10:00:00Z",
        "acquiredReason": "day_1"
      }
    ]
  }
}
```

---

#### POST /api/objects/acquire

오브젝트를 획득합니다. (질문 응답 후 자동 호출)

**Request**

```typescript
// Headers
Authorization: Bearer {token}
Content-Type: application/json

// Body
{
  "objectId": "uuid",
  "reason": "day_5" | "axis_energy_3"
}
```

**Response 201**

```json
{
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "objectId": "uuid",
    "acquiredAt": "2026-02-04T10:00:00Z",
    "acquiredReason": "day_5",
    "object": { /* PixelObject */ }
  }
}
```

**Response 409** - 이미 획득한 오브젝트

```json
{
  "error": {
    "code": "ALREADY_ACQUIRED",
    "message": "이미 획득한 오브젝트입니다."
  }
}
```

---

### 3. Spaces (공간)

#### GET /api/space/{season}

사용자의 시즌별 공간 정보를 조회합니다. 공간이 없으면 자동 생성됩니다.

**Request**

```
Authorization: Bearer {token} (또는 세션 쿠키)
```

**Path Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| season | number | Yes | 시즌 번호 (1, 2, 3...) |

**Response 200**

```json
{
  "data": {
    "space": {
      "id": "uuid",
      "userId": "uuid",
      "seasonId": "uuid",
      "name": "나의 방",
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
      "backgroundVariant": "warm",
      "lastEditedAt": "2026-02-04T10:00:00Z",
      "createdAt": "2026-02-01T00:00:00Z",
      "updatedAt": "2026-02-04T10:00:00Z"
    },
    "placedObjects": [
      {
        "objectId": "uuid",
        "x": 100,
        "y": 200,
        "scale": 1.0,
        "rotation": 0,
        "zIndex": 1,
        "object": {
          "id": "uuid",
          "seasonId": "uuid",
          "categoryId": "uuid",
          "name": "아늑한 침대",
          "description": "편안한 휴식을 위한 침대",
          "imageUrl": "/objects/bed-cozy.png",
          "thumbnailUrl": "/objects/thumb/bed-cozy.png",
          "defaultX": 5,
          "defaultY": 5,
          "width": 64,
          "height": 64,
          "isMovable": true,
          "isResizable": false,
          "acquisitionType": "axis_score",
          "category": {
            "id": "uuid",
            "code": "furniture",
            "name": "가구",
            "layerOrder": 2
          }
        }
      }
    ],
    "season": {
      "id": "uuid",
      "seasonNumber": 1,
      "name": "나의 방",
      "description": "첫 번째 시즌: 나만의 방을 꾸며보세요",
      "spaceType": "room",
      "spaceBackgroundUrl": "/backgrounds/room-default.png",
      "totalQuestions": 24,
      "totalDays": 24,
      "isActive": true,
      "startDate": "2026-02-01",
      "endDate": "2026-02-28"
    }
  }
}
```

**Response 400** - 유효하지 않은 시즌 번호

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "유효하지 않은 시즌 번호입니다."
  }
}
```

**Response 404** - 시즌을 찾을 수 없음

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "시즌을(를) 찾을 수 없습니다."
  }
}
```

---

#### PUT /api/space/{season}

공간 레이아웃, 배경, 설정을 수정합니다.

**Request**

```typescript
// Headers
Authorization: Bearer {token}
Content-Type: application/json

// Body
{
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
  "backgroundVariant": "warm",
  "name": "나의 아늑한 방",
  "isPublic": true
}
```

**Request Body Fields**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| layout | ObjectPlacement[] | No | 오브젝트 배치 정보 배열 |
| backgroundVariant | string | No | 배경 변형 (최대 50자) |
| name | string | No | 공간 이름 (최대 100자) |
| isPublic | boolean | No | 공개 여부 |

**ObjectPlacement Schema**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| objectId | uuid | Yes | 오브젝트 ID |
| x | number | Yes | X 좌표 |
| y | number | Yes | Y 좌표 |
| scale | number | No | 크기 비율 (0.1~3, 기본값: 1) |
| rotation | number | No | 회전 각도 (0~360, 기본값: 0) |
| zIndex | number | No | 레이어 순서 (0 이상, 기본값: 0) |

**Response 200**

```json
{
  "data": {
    "space": {
      "id": "uuid",
      "userId": "uuid",
      "seasonId": "uuid",
      "name": "나의 아늑한 방",
      "isPublic": true,
      "layout": [ /* updated layout */ ],
      "backgroundVariant": "warm",
      "lastEditedAt": "2026-02-04T10:30:00Z",
      "createdAt": "2026-02-01T00:00:00Z",
      "updatedAt": "2026-02-04T10:30:00Z"
    },
    "message": "공간이 성공적으로 수정되었습니다."
  }
}
```

**Response 400** - 유효성 검증 실패

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "소유하지 않은 오브젝트가 포함되어 있습니다.",
    "details": {
      "unownedObjectIds": ["uuid1", "uuid2"]
    }
  }
}
```

---

### 4. Objects Inventory (오브젝트 인벤토리)

#### GET /api/objects/inventory

사용자가 획득한 오브젝트 목록을 조회합니다.

**Request**

```
Authorization: Bearer {token}
```

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| season | number | No | 시즌 번호로 필터링 |
| category | string | No | 카테고리 코드로 필터링 (furniture, decoration 등) |

**Response 200**

```json
{
  "data": {
    "items": [
      {
        "userObject": {
          "id": "uuid",
          "userId": "uuid",
          "objectId": "uuid",
          "acquiredAt": "2026-02-04T10:00:00Z",
          "acquiredReason": "day_1"
        },
        "object": {
          "id": "uuid",
          "seasonId": "uuid",
          "categoryId": "uuid",
          "name": "아늑한 침대",
          "description": "편안한 휴식을 위한 침대",
          "imageUrl": "/objects/bed-cozy.png",
          "thumbnailUrl": "/objects/thumb/bed-cozy.png",
          "defaultX": 5,
          "defaultY": 5,
          "width": 64,
          "height": 64,
          "isMovable": true,
          "isResizable": false,
          "acquisitionType": "axis_score",
          "category": {
            "id": "uuid",
            "code": "furniture",
            "name": "가구",
            "layerOrder": 2
          }
        },
        "isPlaced": false
      }
    ],
    "groupedByCategory": [
      {
        "category": {
          "id": "uuid",
          "code": "background",
          "name": "배경",
          "layerOrder": 1
        },
        "items": [ /* InventoryItem[] */ ]
      },
      {
        "category": {
          "id": "uuid",
          "code": "furniture",
          "name": "가구",
          "layerOrder": 2
        },
        "items": [ /* InventoryItem[] */ ]
      }
    ],
    "totalCount": 15,
    "placedCount": 8,
    "filters": {
      "season": null,
      "category": null
    }
  }
}
```

---

### 5. Objects Placement (오브젝트 배치)

#### POST /api/objects/place

공간에 오브젝트를 배치합니다. 이미 배치된 오브젝트의 경우 위치가 업데이트됩니다.

**Request**

```typescript
// Headers
Authorization: Bearer {token}
Content-Type: application/json

// Body
{
  "objectId": "uuid",
  "seasonId": "uuid",
  "x": 100,
  "y": 200,
  "scale": 1.0,
  "rotation": 0,
  "zIndex": 5
}
```

**Request Body Fields**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| objectId | uuid | Yes | 배치할 오브젝트 ID |
| seasonId | uuid | Yes | 배치할 공간의 시즌 ID |
| x | number | Yes | X 좌표 |
| y | number | Yes | Y 좌표 |
| scale | number | No | 크기 비율 (0.1~3, 기본값: 1) |
| rotation | number | No | 회전 각도 (0~360, 기본값: 0) |
| zIndex | number | No | 레이어 순서 (자동 계산됨) |

**Response 201**

```json
{
  "data": {
    "placement": {
      "objectId": "uuid",
      "x": 100,
      "y": 200,
      "scale": 1.0,
      "rotation": 0,
      "zIndex": 5
    },
    "object": {
      "id": "uuid",
      "name": "아늑한 침대",
      "imageUrl": "/objects/bed-cozy.png",
      "thumbnailUrl": "/objects/thumb/bed-cozy.png",
      "width": 64,
      "height": 64,
      "category": {
        "id": "uuid",
        "code": "furniture",
        "name": "가구",
        "layer_order": 2
      }
    },
    "isUpdate": false,
    "message": "오브젝트가 배치되었습니다."
  }
}
```

**Response 403** - 소유하지 않은 오브젝트

```json
{
  "error": {
    "code": "OBJECT_NOT_OWNED",
    "message": "소유하지 않은 오브젝트입니다."
  }
}
```

**Response 400** - 시즌 불일치

```json
{
  "error": {
    "code": "INVALID_SEASON",
    "message": "해당 시즌의 오브젝트가 아닙니다."
  }
}
```

---

#### DELETE /api/objects/place/{objectId}

공간에서 오브젝트를 제거합니다.

**Request**

```
Authorization: Bearer {token}
```

**Path Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| objectId | uuid | Yes | 제거할 오브젝트 ID |

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| seasonId | uuid | No | 특정 시즌의 공간에서만 제거 (미지정 시 모든 공간에서 제거) |

**Response 204** - No Content (성공)

**Response 404** - 배치되지 않은 오브젝트

```json
{
  "error": {
    "code": "OBJECT_NOT_OWNED",
    "message": "배치되지 않은 오브젝트입니다."
  }
}
```

---

#### DELETE /api/objects/place

쿼리 파라미터를 사용하여 오브젝트를 제거합니다. (대안 엔드포인트)

**Request**

```
Authorization: Bearer {token}
```

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| objectId | uuid | Yes | 제거할 오브젝트 ID |
| seasonId | uuid | Yes | 시즌 ID |

**Response 204** - No Content (성공)

---

### 6. Friends (친구 비교)

#### GET /api/friends/:friendId/compare

친구와 점수를 비교합니다.

**Request**

```
Authorization: Bearer {token}
```

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| seasonId | uuid | No | 특정 시즌만 비교 |

**Response 200**

```json
{
  "data": {
    "myScores": [
      {
        "axisCode": "energy",
        "axisName": "에너지 방향",
        "lowEndName": "내향",
        "highEndName": "외향",
        "averageScore": 3.75,
        "finalScore": 4
      }
    ],
    "friendScores": [
      {
        "axisCode": "energy",
        "axisName": "에너지 방향",
        "lowEndName": "내향",
        "highEndName": "외향",
        "averageScore": 2.25,
        "finalScore": 2
      }
    ],
    "similarities": [
      {
        "axisCode": "energy",
        "axisName": "에너지 방향",
        "scoreDifference": 1.5,
        "isSimilar": false
      }
    ],
    "overallSimilarity": 72,
    "friendInfo": {
      "id": "uuid",
      "nickname": "친구닉네임",
      "avatarUrl": "/avatars/friend.png"
    }
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | 입력 유효성 검증 실패 |
| UNAUTHORIZED | 401 | 인증 필요 |
| FORBIDDEN | 403 | 권한 없음 |
| NOT_FOUND | 404 | 리소스를 찾을 수 없음 |
| ALREADY_ACQUIRED | 409 | 이미 획득한 오브젝트 |
| INVALID_PLACEMENT | 400 | 오브젝트 배치 유효성 실패 |
| INVALID_SEASON | 400 | 유효하지 않은 시즌 |
| SPACE_NOT_FOUND | 404 | 공간을 찾을 수 없음 |
| OBJECT_NOT_OWNED | 403 | 소유하지 않은 오브젝트 |
| OBJECT_ALREADY_PLACED | 409 | 이미 배치된 오브젝트 |
| DATABASE_ERROR | 500 | 데이터베이스 오류 |
| INTERNAL_ERROR | 500 | 서버 내부 오류 |

---

## Data Types Reference

### AxisCode

```typescript
type AxisCode =
  | 'energy'      // 에너지 방향: 내향 - 외향
  | 'lifestyle'   // 생활 패턴: 루틴 - 즉흥
  | 'emotion'     // 감성 스타일: 이성 - 감성
  | 'aesthetic'   // 미적 취향: 미니멀 - 맥시멀
  | 'social'      // 사회적 성향: 개인 - 협력
  | 'challenge'   // 도전 성향: 안정 - 모험
  | 'relationship' // 관계 방식: 깊은관계 - 넓은관계
```

### AcquisitionType

```typescript
type AcquisitionType =
  | 'axis_score'  // 축 점수 기반 획득
  | 'day'         // 일차 기반 획득
  | 'default'     // 기본 제공
```

### ScoreValue

점수는 1~5 스펙트럼으로 표현됩니다:
- **1**: 스펙트럼 왼쪽 극단 (내향, 루틴, 이성 등)
- **3**: 중립
- **5**: 스펙트럼 오른쪽 극단 (외향, 즉흥, 감성 등)

---

## Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.1 | 2026-02-04 | 공간/오브젝트 API 구현: GET/PUT /api/space/[season], GET /api/objects/inventory, POST/DELETE /api/objects/place | backend-dev |
| 1.0 | 2026-02-04 | 초기 작성: 점수 계산, 오브젝트, 공간 API | backend-dev |
