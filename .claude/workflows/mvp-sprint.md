# Workflow: MVP Sprint

새 프로젝트의 MVP를 빠르게 개발하는 워크플로우.

---

## 개요

| 항목 | 내용 |
|------|------|
| **목적** | 아이디어 → 동작하는 MVP |
| **소요 시간** | 프로젝트 규모에 따라 다름 |
| **핵심 원칙** | 빠른 검증, 완벽보다 완성 |

---

## 단계별 흐름

```
Phase 1: 기획
    CEO → planner → product-manager
    
Phase 2: 디자인
    planner → ux-designer → ui-designer
    
Phase 3: 개발
    planner → backend-dev + frontend-dev (병렬)
    
Phase 4: QA & 배포
    planner → qa-engineer → devops
```

---

## Phase 1: 기획 (Planning)

### 1.1 요구사항 수집

**planner 작업:**
```markdown
@CEO 확인 요청

MVP 시작을 위해 다음 정보가 필요합니다:

1. **핵심 목표**: 이 제품이 해결하려는 문제는?
2. **타겟 사용자**: 누가 사용하나요?
3. **필수 기능**: MVP에 꼭 필요한 기능 3-5개는?
4. **레퍼런스**: 참고하고 싶은 서비스가 있나요?
5. **기술 제약**: 특별히 원하는 기술 스택이 있나요?
6. **일정**: 목표 기한이 있나요?
```

### 1.2 PRD 작성

**product-manager 작업:**
- PRD 작성 (`/docs/prd-{project}.md`)
- MVP 범위 정의 (In/Out Scope)
- 기능 우선순위 (P0/P1/P2)

**산출물:** `/docs/prd-{project}.md`

### 1.3 CEO 승인

**planner 작업:**
```markdown
@CEO PRD 검토 요청

PRD 작성이 완료되었습니다.
- 문서: /docs/prd-{project}.md

확인 부탁드립니다:
1. MVP 범위가 적절한가요?
2. 기능 우선순위가 맞나요?
3. 수정/추가할 사항이 있나요?
```

**게이트:** CEO 승인 후 Phase 2 진행

---

## Phase 2: 디자인 (Design)

### 2.1 레퍼런스 수집

**ui-designer 작업:**
```markdown
@CEO 레퍼런스 요청

디자인 방향 설정을 위해 레퍼런스가 필요합니다:

1. 참고하고 싶은 서비스 3개 (URL 또는 앱 이름)
2. 각 서비스에서 참고할 포인트
3. 가능하면 스크린샷
```

### 2.2 UX 설계

**ux-designer 작업:**
- 사용자 플로우 설계
- 와이어프레임 제작
- 정보 구조(IA) 설계

**산출물:**
- `/design/flows/`
- `/design/wireframes/`
- `/design/ia/`

### 2.3 UI 디자인

**ui-designer 작업:**
- 레퍼런스 분석 → 스타일 토큰 번역
- 디자인 시스템 구축
- 화면별 UI 명세

**산출물:**
- `/design/references/`
- `/design/system/`
- `/design/ui/`

### 2.4 디자인 검수

**reviewer 작업:**
- UX 사용성 검증
- UI 일관성 검증
- 접근성 검증

### 2.5 CEO 확인

**planner 작업:**
```markdown
@CEO 디자인 방향 확인

디자인 방향 제안입니다:
- 레퍼런스: {Primary}, {Secondary}, {Accent}
- 컬러: {Primary Color}
- 톤앤매너: {키워드}

문서: /design/references/direction-decision.md

이 방향으로 진행해도 될까요?
```

**게이트:** CEO 확인 후 Phase 3 진행

---

## Phase 3: 개발 (Development)

### 3.1 프로젝트 초기화

**devops 작업:**
- 프로젝트 생성 (Next.js)
- Supabase 프로젝트 설정
- 환경 변수 설정
- Git 저장소 설정

### 3.2 DB 스키마 설계

**backend-dev 작업:**
- 스키마 설계 (`/docs/db-schema.md`)
- 마이그레이션 작성 (`/supabase/migrations/`)
- RLS 정책 설정

### 3.3 API 개발

**backend-dev 작업:**
- API 스펙 작성 (`/docs/api-spec.md`)
- API 구현
- 인증/인가 구현

### 3.4 Frontend 개발

**frontend-dev 작업:** (backend-dev와 병렬 진행 가능)
- 스타일 토큰 적용 (tailwind.config.js)
- 컴포넌트 구현
- 페이지 구현
- API 연동

### 3.5 개발 검수

**reviewer 작업:**
- 코드 품질 검수
- 기능 동작 확인
- 디자인 일치 확인

---

## Phase 4: QA & 배포 (QA & Deploy)

### 4.1 테스트

**qa-engineer 작업:**
- 테스트 케이스 작성
- 기능 테스트 실행
- 버그 리포트 작성

### 4.2 버그 수정

**frontend-dev / backend-dev 작업:**
- 버그 수정
- qa-engineer 재검증

### 4.3 배포

**devops 작업:**
- Staging 배포 & 테스트
- Production 배포
- 모니터링 설정

### 4.4 최종 확인

**planner 작업:**
```markdown
@CEO MVP 완료 보고

MVP 개발이 완료되었습니다.

## 결과
- URL: {production URL}
- 구현된 기능: {기능 목록}
- 알려진 이슈: {있다면}

## 다음 단계 제안
- {P1 기능 개발}
- {개선 사항}

확인 부탁드립니다.
```

---

## 체크리스트

### Phase 1 완료 조건
- [ ] PRD 작성 완료
- [ ] CEO 승인

### Phase 2 완료 조건
- [ ] 사용자 플로우 완료
- [ ] 와이어프레임 완료
- [ ] 디자인 시스템 완료
- [ ] UI 명세 완료
- [ ] reviewer 검수 통과
- [ ] CEO 디자인 방향 확인

### Phase 3 완료 조건
- [ ] DB 스키마 완료
- [ ] API 구현 완료
- [ ] Frontend 구현 완료
- [ ] reviewer 검수 통과

### Phase 4 완료 조건
- [ ] QA 테스트 완료
- [ ] Critical 버그 없음
- [ ] Production 배포 완료
- [ ] CEO 최종 확인

---

## 주의사항

1. **MVP 범위 고수** — 범위 확장(Scope Creep) 주의
2. **빠른 피드백** — CEO 확인 포인트에서 빠르게 피드백
3. **완벽보다 완성** — 80% 품질로 빠르게 출시, 이후 개선
4. **병렬 작업 활용** — backend-dev + frontend-dev 병렬 진행