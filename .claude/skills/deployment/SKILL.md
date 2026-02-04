---
name: deployment
description: 배포 및 인프라 설정 가이드. Vercel 배포, 환경 변수 관리, CI/CD 설정 시 사용. devops가 참조.
---

# Deployment Guide

Vercel + Supabase 기반 배포 및 인프라 설정 가이드.

## 환경 구분

| 환경 | 용도 | URL |
|------|------|-----|
| development | 로컬 개발 | localhost:3000 |
| preview | PR 미리보기 | *.vercel.app |
| staging | 배포 전 테스트 | staging.{domain} |
| production | 실서비스 | {domain} |

## Vercel 배포

### 초기 설정

```markdown
1. GitHub 저장소 연결
2. Framework: Next.js
3. Root Directory: /
4. Build Command: npm run build
5. Output Directory: .next
```

### vercel.json

```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "regions": ["icn1"],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-store" }
      ]
    }
  ]
}
```

### 도메인 설정

```markdown
1. Vercel Dashboard → Domains
2. 도메인 추가
3. DNS 설정:
   - A: 76.76.21.21
   - 또는 CNAME: cname.vercel-dns.com
```

## 환경 변수

### 분류

| 접두사 | 노출 | 용도 |
|--------|------|------|
| NEXT_PUBLIC_ | 클라이언트 | 공개 가능한 값 |
| (없음) | 서버만 | 시크릿 |

### 필수 환경 변수

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_APP_URL=

# OAuth (선택)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### 설정 위치

| 환경 | 위치 |
|------|------|
| 로컬 | .env.local (gitignore) |
| Vercel | Dashboard → Settings → Environment Variables |

## CI/CD

### Vercel 자동 배포

```markdown
- main 브랜치 → Production
- PR → Preview (자동 URL 생성)
```

### GitHub Actions (선택)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test
```

## 배포 체크리스트

### 코드
- [ ] 모든 테스트 통과
- [ ] TypeScript 에러 없음
- [ ] ESLint 경고 없음
- [ ] 빌드 성공

### 환경 변수
- [ ] Production 환경 변수 설정
- [ ] Secret 노출 없음
- [ ] .env.local이 .gitignore에 포함

### 데이터베이스
- [ ] 마이그레이션 적용됨
- [ ] RLS 정책 확인
- [ ] 롤백 계획 있음

### 보안
- [ ] HTTPS 강제
- [ ] 보안 헤더 설정
- [ ] 인증/인가 확인

### 최종
- [ ] Staging 테스트 완료
- [ ] QA 승인
- [ ] 롤백 계획 준비

## 보안 헤더

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}
```

## 모니터링

### Vercel Analytics

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

### Sentry (에러 모니터링)

```bash
npx @sentry/wizard@latest -i nextjs
```

## 롤백

### Vercel 롤백

```markdown
1. Vercel Dashboard → Deployments
2. 이전 배포 찾기
3. "..." → "Promote to Production"
```

### DB 롤백

```markdown
1. 문제 파악
2. Supabase SQL Editor
3. 롤백 SQL 실행
```

## 문서화

### 인프라 문서 위치

```
docs/
└── infrastructure/
    ├── environments.md   # 환경별 설정
    ├── deployment.md     # 배포 가이드
    ├── env-variables.md  # 환경 변수 목록 (값 제외)
    └── monitoring.md     # 모니터링 설정
```