# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.


## 프로젝트 개요

AI Agent 팀 기반 제품 개발 프레임워크. CEO의 아이디어를 MVP로 빠르게 구현.


## 빌드 및 실행 명령어

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 린트
npm run lint

# 타입 체크
npm run type-check

# Supabase 로컬 실행 (필요시)
npx supabase start

# Supabase 마이그레이션
npx supabase db push
```


## 환경 설정

```bash
# 환경 변수 파일 생성
cp .env.example .env.local
```

필수 환경 변수:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon 키
- `NEXT_PUBLIC_APP_URL`: 앱 URL (개발시 `http://localhost:3000`)


## 아키텍처

### Agent 시스템

모든 요청은 planner를 통해 처리됨:

```
CEO (사용자)
    ↓ 요청
planner (오케스트레이터)
    ↓ 태스크 분배
[Agents] → reviewer (검수)
    ↓
planner → CEO (완료 보고)
```

### Agent 역할과 산출물

| Agent | 역할 | 산출물 위치 |
|-------|------|-------------|
| planner | 태스크 분해, 조율, 보고 | `.claude/tasks/` |
| reviewer | 품질 검수 (읽기 전용) | 검수 결과 |
| product-manager | PRD 작성 | `/docs/prd-*.md` |
| ux-designer | 플로우, 와이어프레임 | `/design/flows/`, `/design/wireframes/` |
| ui-designer | 비주얼 디자인, 디자인 시스템 | `/design/system/`, `/design/ui/` |
| frontend-dev | UI 구현 | `/src/` |
| backend-dev | API, DB 구현 | `/src/app/api/`, `/supabase/` |
| qa-engineer | 테스트, 버그 리포트 | `/qa/` |
| devops | 배포, 인프라 | `/docs/infrastructure/` |

### 워크플로우 선택

| 워크플로우 | 용도 | 파일 |
|------------|------|------|
| mvp-sprint | 새 프로젝트 MVP 개발 | `.claude/workflows/mvp-sprint.md` |
| feature-add | 기존 프로젝트에 기능 추가 | `.claude/workflows/feature-add.md` |
| bug-fix | 버그 수정 | `.claude/workflows/bug-fix.md` |
| design-first | 디자인부터 시작 | `.claude/workflows/design-first.md` |
| hotfix | 긴급 장애 대응 | `.claude/workflows/hotfix.md` |


## 기술 스택 (기본값)

프로젝트별로 PRD에서 재정의 가능

| 영역 | 기술 |
|------|------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| State | React hooks, Zustand |
| Forms | React Hook Form + Zod |
| Infra | Vercel |


## 디렉토리 구조

```
.claude/
├── agents/           # Agent 정의 파일
├── skills/           # 공유 지식 (코딩 표준, 디자인 시스템 등)
├── workflows/        # 워크플로우 정의
└── tasks/            # 태스크 관리
    ├── _active/      # 진행 중
    ├── _done/        # 완료
    └── _backlog/     # 대기

project-root/
├── docs/             # PRD, API 명세, 인프라 문서
├── design/           # 레퍼런스, 디자인 시스템, 플로우, UI
├── src/              # 소스 코드
│   ├── app/          # Next.js App Router (페이지, API 라우트)
│   ├── components/   # React 컴포넌트 (ui/, common/, features/)
│   ├── hooks/        # 커스텀 훅
│   ├── lib/          # 유틸리티 함수
│   ├── types/        # TypeScript 타입 정의
│   └── styles/       # 글로벌 스타일
├── supabase/         # Supabase 마이그레이션
└── qa/               # 테스트 케이스, 결과, 버그 리포트
```

### 경로 별칭

tsconfig.json에 설정된 경로 별칭:
- `@/*` → `./src/*` (예: `import { Button } from '@/components/ui/Button'`)


## 핵심 원칙

1. **CEO = 최종 결정권자** — 중요 사항은 CEO 확인
2. **planner = 단일 진입점** — 모든 요청은 planner 경유
3. **reviewer = 필수 검수** — 모든 산출물은 reviewer 검수 후 완료
4. **레퍼런스 기반 디자인** — 디자인은 레퍼런스 3개 기반
5. **사용성 우선** — UX는 Nielsen 휴리스틱 + 사용성 법칙 준수


## 코딩 컨벤션

### 네이밍

| 종류 | 컨벤션 | 예시 |
|------|--------|------|
| 변수/함수 | camelCase | `userName`, `getUserById` |
| 상수 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 타입/인터페이스 | PascalCase | `UserProfile` |
| 컴포넌트 | PascalCase.tsx | `LoginForm.tsx` |
| 유틸 | camelCase.ts | `formatDate.ts` |
| 폴더 | kebab-case | `user-profile/` |

### TypeScript

- `any` 대신 `unknown` + 타입 가드 사용
- `enum` 대신 `const object as const` 사용
- optional chaining (`?.`)과 nullish coalescing (`??`) 활용

### React

- 컴포넌트 구조: imports → types → hooks → handlers → early returns → render
- 커스텀 훅으로 로직 분리
- 조건부 렌더링: boolean만 `&&` 사용, 숫자는 `> 0` 체크


## 시작하기

```
# 새 프로젝트 시작
@planner 새 프로젝트 시작: {프로젝트 설명}

# 기능 추가
@planner 기능 추가: {기능 설명}

# 버그 수정
@planner 버그 수정: {버그 설명}
```


## Agent 간 커뮤니케이션

```markdown
# 협업 요청
@{agent-name} {요청 내용}
- 필요 정보: {정보}
- 참조: {파일 경로}

# 검수 요청
@reviewer 검수 요청
- 태스크: TASK-{번호}
- Agent: {agent-name}
- 산출물: {파일 경로}
```
