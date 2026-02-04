---
name: db-schema
description: 데이터베이스 스키마 설계 및 관리 가이드. 테이블 설계, 관계 정의, 마이그레이션 작성 시 사용. backend-dev가 참조. Supabase/PostgreSQL 기반.
---

# DB Schema Design

PostgreSQL/Supabase 기반 데이터베이스 스키마 설계 가이드.

## 설계 원칙

### 1. 정규화
- 데이터 중복 최소화
- 1NF, 2NF, 3NF 적용
- 필요시 역정규화 (성능)

### 2. 명명 규칙
- 테이블: snake_case, 복수형 (`users`, `posts`)
- 컬럼: snake_case (`created_at`, `user_id`)
- PK: `id`
- FK: `{table}_id` (`user_id`, `post_id`)
- 인덱스: `idx_{table}_{column}`

### 3. 필수 컬럼
모든 테이블에 포함:
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
created_at  timestamptz DEFAULT now()
updated_at  timestamptz DEFAULT now()
```

## 스키마 문서 형식

```markdown
# Database Schema

## Tables

### users
사용자 정보

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | 사용자 ID |
| email | varchar(255) | UNIQUE, NOT NULL | 이메일 |
| password_hash | varchar(255) | NOT NULL | 비밀번호 해시 |
| name | varchar(100) | NOT NULL | 이름 |
| created_at | timestamptz | DEFAULT now() | 생성일 |
| updated_at | timestamptz | DEFAULT now() | 수정일 |
| deleted_at | timestamptz | | 삭제일 (soft delete) |

**Indexes**
- `idx_users_email` on (email)

### posts
게시글

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | 게시글 ID |
| user_id | uuid | FK → users.id | 작성자 |
| title | varchar(200) | NOT NULL | 제목 |
| content | text | | 내용 |
| status | varchar(20) | DEFAULT 'draft' | 상태 |
| created_at | timestamptz | DEFAULT now() | 생성일 |

**Indexes**
- `idx_posts_user_id` on (user_id)
- `idx_posts_status_created` on (status, created_at DESC)

## Relationships
- users 1:N posts (user_id)
```

## 마이그레이션 형식

### Supabase Migration

```sql
-- supabase/migrations/20250101000000_create_users.sql

-- Create users table
create table users (
  id uuid primary key default gen_random_uuid(),
  email varchar(255) unique not null,
  password_hash varchar(255) not null,
  name varchar(100) not null,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

-- Create index
create index idx_users_email on users(email);

-- Enable RLS
alter table users enable row level security;

-- RLS Policies
create policy "Users can view own profile"
  on users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on users for update
  using (auth.uid() = id);

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at
  before update on users
  for each row execute function update_updated_at();
```

## 자주 쓰는 패턴

### Soft Delete

```sql
-- 테이블에 deleted_at 추가
deleted_at timestamptz

-- 삭제 시
update users set deleted_at = now() where id = $1;

-- 조회 시 (RLS 정책)
create policy "Exclude deleted"
  on users for select
  using (deleted_at is null);
```

### Enum (상태 관리)

```sql
-- 방법 1: CHECK constraint
status varchar(20) check (status in ('draft', 'published', 'archived'))

-- 방법 2: Enum type
create type post_status as enum ('draft', 'published', 'archived');
status post_status default 'draft'
```

### JSON 컬럼

```sql
-- 구조화되지 않은 데이터
metadata jsonb default '{}'::jsonb

-- 쿼리
select * from posts where metadata->>'category' = 'tech';
select * from posts where metadata @> '{"featured": true}';

-- 인덱스 (GIN)
create index idx_posts_metadata on posts using gin(metadata);
```

### Many-to-Many

```sql
-- Junction table
create table post_tags (
  post_id uuid references posts(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (post_id, tag_id)
);
```

### 계층 구조 (Self-reference)

```sql
-- 카테고리, 댓글 대댓글 등
create table categories (
  id uuid primary key default gen_random_uuid(),
  name varchar(100) not null,
  parent_id uuid references categories(id),
  created_at timestamptz default now()
);
```

## Row Level Security (RLS)

### 기본 패턴

```sql
-- RLS 활성화
alter table posts enable row level security;

-- 자신의 데이터만 조회
create policy "Users can view own posts"
  on posts for select
  using (auth.uid() = user_id);

-- 자신의 데이터만 생성
create policy "Users can create own posts"
  on posts for insert
  with check (auth.uid() = user_id);

-- 자신의 데이터만 수정
create policy "Users can update own posts"
  on posts for update
  using (auth.uid() = user_id);

-- 자신의 데이터만 삭제
create policy "Users can delete own posts"
  on posts for delete
  using (auth.uid() = user_id);
```

### 공개 데이터

```sql
-- 모든 사용자 조회 가능
create policy "Anyone can view published posts"
  on posts for select
  using (status = 'published');
```

## 인덱스 가이드

### 언제 인덱스?
- WHERE 절에 자주 사용되는 컬럼
- JOIN에 사용되는 FK
- ORDER BY에 사용되는 컬럼
- UNIQUE 제약 조건

### 인덱스 종류

```sql
-- B-tree (기본, 대부분 상황)
create index idx_users_email on users(email);

-- 복합 인덱스 (순서 중요)
create index idx_posts_user_status on posts(user_id, status);

-- 부분 인덱스
create index idx_posts_published on posts(created_at)
  where status = 'published';

-- GIN (JSON, Array)
create index idx_posts_tags on posts using gin(tags);

-- 텍스트 검색
create index idx_posts_search on posts using gin(to_tsvector('korean', title || ' ' || content));
```

## 체크리스트

### 설계 시
- [ ] 테이블/컬럼 명명 규칙 준수
- [ ] 필수 컬럼 포함 (id, created_at, updated_at)
- [ ] 적절한 데이터 타입 선택
- [ ] NOT NULL 제약 적용 (필요한 곳)
- [ ] FK 관계 정의

### 마이그레이션 시
- [ ] 인덱스 설정
- [ ] RLS 정책 설정
- [ ] 트리거 설정 (updated_at)
- [ ] 롤백 가능 여부 확인

### 성능
- [ ] 쿼리 패턴에 맞는 인덱스
- [ ] N+1 쿼리 방지
- [ ] 불필요한 SELECT * 피함