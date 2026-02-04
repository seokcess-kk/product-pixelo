# PIXELO Questions API Specification

## Base URL
`/api/questions`

## Authentication
모든 엔드포인트는 Supabase Auth를 통한 인증이 필요합니다.
- Cookie 기반 세션 인증 (Supabase SSR)
- 인증되지 않은 요청 시 401 Unauthorized 반환

---

## Endpoints

### 1. 오늘의 질문 조회

#### GET /api/questions/today

사용자가 아직 답하지 않은 질문 최대 5개를 반환합니다.
현재 활성 시즌의 질문만 필터링됩니다.

**Request**
- Headers:
  - Cookie: Supabase 세션 쿠키
- Parameters: 없음

**Response 200 OK**
```json
{
  "data": {
    "seasonId": "uuid",
    "seasonName": "나의 방",
    "questions": [
      {
        "id": "uuid",
        "dayNumber": 1,
        "questionText": "주말 아침, 눈을 떴을 때 가장 하고 싶은 것은?",
        "questionType": "single_choice",
        "choices": [
          {
            "id": "uuid",
            "order": 1,
            "text": "침대에서 뒹굴며 책을 읽거나 영상을 본다"
          },
          {
            "id": "uuid",
            "order": 2,
            "text": "조용한 카페에서 혼자만의 시간을 보낸다"
          },
          {
            "id": "uuid",
            "order": 3,
            "text": "친구에게 연락해서 브런치 약속을 잡는다"
          },
          {
            "id": "uuid",
            "order": 4,
            "text": "활기찬 장소로 나가 사람들 속에서 에너지를 얻는다"
          }
        ]
      }
    ],
    "progress": {
      "currentDay": 0,
      "totalDays": 24
    }
  }
}
```

**Response 401 Unauthorized**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "인증이 필요합니다."
  }
}
```

**Response 404 Not Found**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "활성 시즌을(를) 찾을 수 없습니다."
  }
}
```

---

### 2. 응답 저장

#### POST /api/questions/answer

사용자의 질문 응답을 저장하고, 축 점수를 재계산하며, 획득 가능한 오브젝트를 처리합니다.

**Request**
- Headers:
  - Cookie: Supabase 세션 쿠키
  - Content-Type: application/json
- Body:
```json
{
  "questionId": "uuid (required)",
  "choiceId": "uuid (required)"
}
```

**Response 201 Created**
```json
{
  "data": {
    "answerId": "uuid",
    "questionId": "uuid",
    "choiceId": "uuid",
    "answeredAt": "2025-02-04T10:30:00.000Z",
    "axisScore": {
      "axisCode": "energy",
      "axisName": "에너지 방향",
      "scoreValue": 1,
      "newAverage": 1.5
    },
    "acquiredObjects": [
      {
        "id": "uuid",
        "name": "Day 1 웰컴 인형",
        "imageUrl": "/images/objects/welcome-plush.png",
        "thumbnailUrl": "/images/objects/thumbs/welcome-plush.png",
        "reason": "Day 1 완료"
      }
    ]
  }
}
```

**Response 400 Bad Request - 유효성 검증 실패**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력 데이터가 유효하지 않습니다.",
    "details": [
      {
        "field": "questionId",
        "message": "유효한 질문 ID가 필요합니다."
      }
    ]
  }
}
```

**Response 401 Unauthorized**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "인증이 필요합니다."
  }
}
```

**Response 404 Not Found**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "질문을(를) 찾을 수 없습니다."
  }
}
```

**Response 409 Conflict**
```json
{
  "error": {
    "code": "CONFLICT",
    "message": "이미 답변한 질문입니다."
  }
}
```

---

### 3. 진행률 조회

#### GET /api/questions/progress

시즌별 답변 완료 수와 전체 진행률을 조회합니다.

**Request**
- Headers:
  - Cookie: Supabase 세션 쿠키
- Query Parameters:
  - `seasonId` (optional): 특정 시즌 ID. 지정하지 않으면 현재 활성 시즌

**Response 200 OK**
```json
{
  "data": {
    "seasonId": "uuid",
    "seasonName": "나의 방",
    "currentDay": 7,
    "totalDays": 24,
    "isCompleted": false,
    "answeredCount": 7,
    "progressPercentage": 29,
    "axisScores": [
      {
        "axisCode": "energy",
        "axisName": "에너지 방향",
        "lowEndName": "내향",
        "highEndName": "외향",
        "answerCount": 4,
        "averageScore": 2.25,
        "finalScore": null
      },
      {
        "axisCode": "lifestyle",
        "axisName": "생활 패턴",
        "lowEndName": "루틴",
        "highEndName": "즉흥",
        "answerCount": 3,
        "averageScore": 3.67,
        "finalScore": null
      }
    ]
  }
}
```

**Response 401 Unauthorized**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "인증이 필요합니다."
  }
}
```

**Response 404 Not Found**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "시즌을(를) 찾을 수 없습니다."
  }
}
```

---

### 4. 특정 질문 조회

#### GET /api/questions/[questionId]

특정 질문의 상세 정보를 조회합니다.
각 선택지의 축 정보와 사용자의 기존 응답 정보도 포함됩니다.

**Request**
- Headers:
  - Cookie: Supabase 세션 쿠키
- Path Parameters:
  - `questionId` (required): 질문 UUID

**Response 200 OK**
```json
{
  "data": {
    "id": "uuid",
    "seasonId": "uuid",
    "dayNumber": 1,
    "questionText": "주말 아침, 눈을 떴을 때 가장 하고 싶은 것은?",
    "questionType": "single_choice",
    "choices": [
      {
        "id": "uuid",
        "order": 1,
        "text": "침대에서 뒹굴며 책을 읽거나 영상을 본다",
        "axisInfo": {
          "axisCode": "energy",
          "axisName": "에너지 방향",
          "scoreDirection": "low"
        }
      },
      {
        "id": "uuid",
        "order": 2,
        "text": "조용한 카페에서 혼자만의 시간을 보낸다",
        "axisInfo": {
          "axisCode": "energy",
          "axisName": "에너지 방향",
          "scoreDirection": "low"
        }
      },
      {
        "id": "uuid",
        "order": 3,
        "text": "친구에게 연락해서 브런치 약속을 잡는다",
        "axisInfo": {
          "axisCode": "energy",
          "axisName": "에너지 방향",
          "scoreDirection": "high"
        }
      },
      {
        "id": "uuid",
        "order": 4,
        "text": "활기찬 장소로 나가 사람들 속에서 에너지를 얻는다",
        "axisInfo": {
          "axisCode": "energy",
          "axisName": "에너지 방향",
          "scoreDirection": "high"
        }
      }
    ],
    "userAnswer": {
      "answerId": "uuid",
      "choiceId": "uuid",
      "answeredAt": "2025-02-04T10:30:00.000Z"
    }
  }
}
```

**사용자가 아직 답하지 않은 경우 userAnswer는 null**
```json
{
  "data": {
    "id": "uuid",
    "seasonId": "uuid",
    "dayNumber": 2,
    "questionText": "...",
    "questionType": "single_choice",
    "choices": [...],
    "userAnswer": null
  }
}
```

**Response 400 Bad Request**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "유효한 질문 ID가 필요합니다."
  }
}
```

**Response 401 Unauthorized**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "인증이 필요합니다."
  }
}
```

**Response 404 Not Found**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "질문을(를) 찾을 수 없습니다."
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | 인증이 필요합니다 |
| FORBIDDEN | 403 | 권한이 없습니다 |
| NOT_FOUND | 404 | 리소스를 찾을 수 없습니다 |
| VALIDATION_ERROR | 400 | 입력 데이터가 유효하지 않습니다 |
| CONFLICT | 409 | 리소스 충돌 (중복 응답 등) |
| INTERNAL_ERROR | 500 | 서버 내부 오류 |

---

## Types

### TodayQuestion
```typescript
interface TodayQuestion {
  id: string
  dayNumber: number
  questionText: string
  questionType: string
  choices: QuestionChoice[]
}
```

### QuestionChoice
```typescript
interface QuestionChoice {
  id: string
  order: number
  text: string
}
```

### AnswerResponse
```typescript
interface AnswerResponse {
  answerId: string
  questionId: string
  choiceId: string
  answeredAt: string
  axisScore: {
    axisCode: string
    axisName: string
    scoreValue: number
    newAverage: number
  }
  acquiredObjects: AcquiredObject[]
}
```

### AcquiredObject
```typescript
interface AcquiredObject {
  id: string
  name: string
  imageUrl: string
  thumbnailUrl: string | null
  reason: string
}
```

### ProgressResponse
```typescript
interface ProgressResponse {
  seasonId: string
  seasonName: string
  currentDay: number
  totalDays: number
  isCompleted: boolean
  answeredCount: number
  progressPercentage: number
  axisScores: AxisScoreSummary[]
}
```

### AxisScoreSummary
```typescript
interface AxisScoreSummary {
  axisCode: string
  axisName: string
  lowEndName: string
  highEndName: string
  answerCount: number
  averageScore: number | null
  finalScore: number | null
}
```

---

## Usage Examples

### cURL

**오늘의 질문 조회**
```bash
curl -X GET http://localhost:3000/api/questions/today \
  -H "Cookie: sb-access-token=...; sb-refresh-token=..."
```

**응답 저장**
```bash
curl -X POST http://localhost:3000/api/questions/answer \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=...; sb-refresh-token=..." \
  -d '{"questionId": "uuid-here", "choiceId": "uuid-here"}'
```

**진행률 조회**
```bash
curl -X GET http://localhost:3000/api/questions/progress \
  -H "Cookie: sb-access-token=...; sb-refresh-token=..."
```

**특정 질문 조회**
```bash
curl -X GET http://localhost:3000/api/questions/uuid-here \
  -H "Cookie: sb-access-token=...; sb-refresh-token=..."
```

### TypeScript (Fetch)

```typescript
// 오늘의 질문 조회
const response = await fetch('/api/questions/today')
const { data } = await response.json()

// 응답 저장
const answerResponse = await fetch('/api/questions/answer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    questionId: 'uuid-here',
    choiceId: 'uuid-here',
  }),
})
const { data: answerData } = await answerResponse.json()
```
