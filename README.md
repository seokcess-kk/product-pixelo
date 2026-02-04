# Product Development Team Template

AI Agent 팀 기반 제품 개발 프레임워크. CEO의 아이디어를 MVP로 빠르게 구현합니다.

## 시작하기

### 1. 템플릿에서 새 프로젝트 생성
- GitHub에서 "Use this template" 버튼 클릭
- 새 저장소 이름 입력 후 생성
- 로컬에 클론

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
```bash
cp .env.example .env.local
# .env.local 파일을 열어 실제 값으로 수정
```

### 4. 개발 서버 실행
```bash
npm run dev
```

### 5. Claude Code로 개발 시작
```
@planner 새 프로젝트 시작: {프로젝트 설명}
```

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| State | React hooks, Zustand |
| Forms | React Hook Form + Zod |
| Infra | Vercel |

## 폴더 구조

```
.claude/
├── agents/           # Agent 정의 파일
├── skills/           # 공유 지식 (코딩 표준, 디자인 시스템 등)
├── workflows/        # 워크플로우 정의
└── tasks/            # 태스크 관리
    ├── _active/      # 진행 중
    ├── _done/        # 완료
    └── _backlog/     # 대기

docs/                 # PRD, API 명세, 인프라 문서
design/
├── references/       # 레퍼런스 이미지
├── system/           # 디자인 시스템
├── flows/            # 사용자 플로우
├── wireframes/       # 와이어프레임
└── ui/               # UI 디자인

src/
├── app/              # Next.js App Router
├── components/
│   ├── ui/           # 기본 UI 컴포넌트
│   ├── common/       # 공통 컴포넌트
│   └── features/     # 기능별 컴포넌트
├── hooks/            # 커스텀 훅
├── lib/              # 유틸리티 함수
└── types/            # TypeScript 타입

supabase/
└── migrations/       # DB 마이그레이션

qa/
├── test-cases/       # 테스트 케이스
├── results/          # 테스트 결과
└── bugs/             # 버그 리포트
```

## Agent 시스템

모든 요청은 planner를 통해 처리됩니다:

```
CEO (사용자)
    ↓ 요청
planner (오케스트레이터)
    ↓ 태스크 분배
[Agents] → reviewer (검수)
    ↓
planner → CEO (완료 보고)
```

### 주요 Agent
- **planner**: 태스크 분해, 조율, 보고
- **reviewer**: 품질 검수 (읽기 전용)
- **product-manager**: PRD 작성
- **ux-designer**: 플로우, 와이어프레임
- **ui-designer**: 비주얼 디자인, 디자인 시스템
- **frontend-dev**: UI 구현
- **backend-dev**: API, DB 구현
- **qa-engineer**: 테스트, 버그 리포트
- **devops**: 배포, 인프라

## 워크플로우

| 워크플로우 | 용도 |
|------------|------|
| mvp-sprint | 새 프로젝트 MVP 개발 |
| feature-add | 기존 프로젝트에 기능 추가 |
| bug-fix | 버그 수정 |
| design-first | 디자인부터 시작 |
| hotfix | 긴급 장애 대응 |

## 사용 예시

```
# 새 프로젝트 시작
@planner 새 프로젝트 시작: 사용자가 할일을 관리할 수 있는 투두 앱

# 기능 추가
@planner 기능 추가: 할일에 마감일 설정 기능

# 버그 수정
@planner 버그 수정: 로그인 후 리다이렉트가 안됨
```

## 스크립트

```bash
npm run dev        # 개발 서버 실행
npm run build      # 프로덕션 빌드
npm run start      # 프로덕션 서버 실행
npm run lint       # ESLint 실행
npm run type-check # TypeScript 타입 체크
```

## 라이선스

MIT
