-- =====================================================
-- PIXELO MVP - Initial Database Schema
-- =====================================================
-- Service: Daily questions -> 7-axis scoring -> Object acquisition -> Space completion
-- Features: Season system, Social features (friends, visits)
-- =====================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================================================
-- 1. USERS (사용자 프로필)
-- =====================================================
-- Supabase Auth와 연동되는 사용자 프로필 테이블

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email varchar(255) unique not null,
  nickname varchar(50) not null,
  avatar_url text,
  bio varchar(200),
  is_public boolean default true,  -- 프로필 공개 여부
  onboarding_completed boolean default false,
  last_active_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  deleted_at timestamptz
);

comment on table public.users is '사용자 프로필 정보';
comment on column public.users.is_public is '프로필 공개 여부 (친구 검색, 방문 허용)';
comment on column public.users.onboarding_completed is '온보딩 완료 여부';

create index idx_users_nickname on public.users(nickname) where deleted_at is null;
create index idx_users_created_at on public.users(created_at desc) where deleted_at is null;

-- =====================================================
-- 2. SEASONS (시즌 메타데이터)
-- =====================================================
-- 시즌별 테마와 공간 정보

create table public.seasons (
  id uuid primary key default uuid_generate_v4(),
  season_number integer unique not null,  -- 시즌 번호 (1, 2, 3...)
  name varchar(100) not null,             -- 시즌 이름 ("나의 방", "나의 아지트")
  description text,
  space_type varchar(50) not null,        -- 공간 타입 ("room", "hideout")
  space_background_url text,              -- 기본 공간 배경 이미지
  total_questions integer default 24,     -- 총 질문 수
  total_days integer default 24,          -- 완성까지 필요한 일수
  is_active boolean default false,        -- 현재 활성 시즌 여부
  start_date date,
  end_date date,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

comment on table public.seasons is '시즌 메타데이터';
comment on column public.seasons.space_type is '공간 타입: room(방), hideout(아지트) 등';

create index idx_seasons_active on public.seasons(is_active) where is_active = true;
create index idx_seasons_number on public.seasons(season_number);

-- =====================================================
-- 3. AXIS_DEFINITIONS (7개 측정축 정의)
-- =====================================================
-- 각 시즌의 7개 측정축과 양 극단 정의

create table public.axis_definitions (
  id uuid primary key default uuid_generate_v4(),
  season_id uuid not null references public.seasons(id) on delete cascade,
  axis_code varchar(30) not null,         -- 축 코드 ("energy", "lifestyle", etc.)
  axis_order integer not null,            -- 표시 순서 (1-7)
  name varchar(50) not null,              -- 축 이름 ("에너지 방향")
  name_en varchar(50),                    -- 영문 이름 ("Energy Direction")
  low_end_name varchar(30) not null,      -- 스펙트럼 낮은 쪽 (1) ("내향")
  high_end_name varchar(30) not null,     -- 스펙트럼 높은 쪽 (5) ("외향")
  low_end_description text,               -- 낮은 쪽 설명
  high_end_description text,              -- 높은 쪽 설명
  icon_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,

  unique(season_id, axis_code),
  unique(season_id, axis_order)
);

comment on table public.axis_definitions is '7개 측정축 정의';
comment on column public.axis_definitions.axis_code is '축 식별 코드: energy, lifestyle, emotion, aesthetic, social, challenge, relationship';
comment on column public.axis_definitions.low_end_name is '스펙트럼 1점 방향 이름';
comment on column public.axis_definitions.high_end_name is '스펙트럼 5점 방향 이름';

create index idx_axis_definitions_season on public.axis_definitions(season_id);

-- =====================================================
-- 4. QUESTIONS (질문 데이터)
-- =====================================================
-- 시즌별 일일 질문과 선택지

create table public.questions (
  id uuid primary key default uuid_generate_v4(),
  season_id uuid not null references public.seasons(id) on delete cascade,
  day_number integer not null,            -- 몇 번째 날 질문인지 (1-24)
  question_text text not null,            -- 질문 내용
  question_type varchar(20) default 'single_choice', -- 질문 유형
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,

  unique(season_id, day_number)
);

comment on table public.questions is '일일 질문 데이터';
comment on column public.questions.day_number is '시즌 내 질문 순서 (1-24일)';

create index idx_questions_season_day on public.questions(season_id, day_number);

-- =====================================================
-- 5. QUESTION_CHOICES (질문 선택지)
-- =====================================================
-- 각 질문의 4개 선택지와 연결된 축/점수

create table public.question_choices (
  id uuid primary key default uuid_generate_v4(),
  question_id uuid not null references public.questions(id) on delete cascade,
  choice_order integer not null,          -- 선택지 순서 (1-4)
  choice_text text not null,              -- 선택지 텍스트
  axis_id uuid not null references public.axis_definitions(id) on delete cascade,  -- 연결된 측정축
  score_value integer not null check (score_value between 1 and 5),  -- 해당 축에 부여되는 점수 (1-5)
  created_at timestamptz default now() not null,

  unique(question_id, choice_order)
);

comment on table public.question_choices is '질문별 선택지와 축/점수 매핑';
comment on column public.question_choices.score_value is '선택 시 해당 축에 부여되는 점수 (1-5 스펙트럼)';

create index idx_question_choices_question on public.question_choices(question_id);

-- =====================================================
-- 6. ANSWERS (사용자 응답)
-- =====================================================
-- 사용자별 질문 응답 기록

create table public.answers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  choice_id uuid not null references public.question_choices(id) on delete cascade,
  answered_at timestamptz default now() not null,

  unique(user_id, question_id)  -- 사용자당 질문별 1개 응답만
);

comment on table public.answers is '사용자별 질문 응답 기록';

create index idx_answers_user on public.answers(user_id);
create index idx_answers_user_question on public.answers(user_id, question_id);
create index idx_answers_answered_at on public.answers(answered_at desc);

-- =====================================================
-- 7. USER_SEASONS (사용자별 시즌 참여)
-- =====================================================
-- 사용자가 참여 중인 시즌과 진행 상태

create table public.user_seasons (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  season_id uuid not null references public.seasons(id) on delete cascade,
  current_day integer default 0,          -- 현재 진행 일수 (0 = 시작 전, 1-24)
  is_completed boolean default false,     -- 시즌 완료 여부
  started_at timestamptz default now(),
  completed_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,

  unique(user_id, season_id)
);

comment on table public.user_seasons is '사용자별 시즌 참여 상태';
comment on column public.user_seasons.current_day is '현재 진행 일수 (응답 완료한 질문 수)';

create index idx_user_seasons_user on public.user_seasons(user_id);
create index idx_user_seasons_active on public.user_seasons(user_id, season_id) where is_completed = false;

-- =====================================================
-- 8. AXIS_SCORES (사용자별 축 점수)
-- =====================================================
-- 각 사용자의 7개 축별 누적/평균 점수

create table public.axis_scores (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  season_id uuid not null references public.seasons(id) on delete cascade,
  axis_id uuid not null references public.axis_definitions(id) on delete cascade,
  total_score integer default 0,          -- 누적 점수
  answer_count integer default 0,         -- 응답 횟수
  average_score decimal(3,2),             -- 평균 점수 (1.00 - 5.00)
  final_score integer check (final_score between 1 and 5),  -- 최종 스펙트럼 점수 (1-5)
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,

  unique(user_id, season_id, axis_id)
);

comment on table public.axis_scores is '사용자별 7개 축 점수';
comment on column public.axis_scores.average_score is '평균 점수 (total_score / answer_count)';
comment on column public.axis_scores.final_score is '최종 스펙트럼 점수 (1-5), 시즌 완료 시 확정';

create index idx_axis_scores_user_season on public.axis_scores(user_id, season_id);

-- =====================================================
-- 9. OBJECT_CATEGORIES (오브젝트 카테고리)
-- =====================================================
-- 오브젝트 분류 카테고리

create table public.object_categories (
  id uuid primary key default uuid_generate_v4(),
  code varchar(30) unique not null,       -- 카테고리 코드
  name varchar(50) not null,              -- 카테고리 이름
  layer_order integer not null,           -- 레이어 순서 (낮을수록 뒤에 배치)
  created_at timestamptz default now() not null
);

comment on table public.object_categories is '오브젝트 카테고리 (배경, 가구, 소품 등)';
comment on column public.object_categories.layer_order is '렌더링 레이어 순서 (1=배경, 2=가구, 3=소품)';

-- =====================================================
-- 10. OBJECTS (오브젝트 메타데이터)
-- =====================================================
-- 획득 가능한 오브젝트 정보

create table public.objects (
  id uuid primary key default uuid_generate_v4(),
  season_id uuid not null references public.seasons(id) on delete cascade,
  category_id uuid not null references public.object_categories(id) on delete cascade,
  name varchar(100) not null,             -- 오브젝트 이름
  description text,
  image_url text not null,                -- 오브젝트 이미지 URL
  thumbnail_url text,                     -- 썸네일 URL

  -- 획득 조건 (연결된 축과 점수 범위)
  axis_id uuid references public.axis_definitions(id) on delete set null,  -- 연결된 축
  min_score integer check (min_score between 1 and 5),  -- 최소 점수
  max_score integer check (max_score between 1 and 5),  -- 최대 점수

  -- 배치 관련
  default_x integer default 0,            -- 기본 X 위치
  default_y integer default 0,            -- 기본 Y 위치
  width integer,                          -- 너비 (픽셀)
  height integer,                         -- 높이 (픽셀)
  is_movable boolean default true,        -- 이동 가능 여부
  is_resizable boolean default false,     -- 크기 조절 가능 여부

  -- 획득 조건 타입
  acquisition_type varchar(20) default 'axis_score',  -- 획득 조건 타입
  acquisition_day integer,                -- 특정 일차에 획득 (day 타입용)

  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

comment on table public.objects is '오브젝트 메타데이터';
comment on column public.objects.acquisition_type is 'axis_score(축 점수 기반), day(일차 기반), default(기본 제공)';
comment on column public.objects.min_score is '획득 조건: 해당 축의 최소 점수';
comment on column public.objects.max_score is '획득 조건: 해당 축의 최대 점수';

create index idx_objects_season on public.objects(season_id);
create index idx_objects_category on public.objects(category_id);
create index idx_objects_axis on public.objects(axis_id);
create index idx_objects_acquisition on public.objects(acquisition_type, acquisition_day);

-- =====================================================
-- 11. USER_OBJECTS (사용자 획득 오브젝트)
-- =====================================================
-- 사용자가 획득한 오브젝트 목록

create table public.user_objects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  object_id uuid not null references public.objects(id) on delete cascade,
  acquired_at timestamptz default now() not null,
  acquired_reason varchar(50),            -- 획득 사유 ("day_1", "axis_energy_3", etc.)

  unique(user_id, object_id)
);

comment on table public.user_objects is '사용자가 획득한 오브젝트';
comment on column public.user_objects.acquired_reason is '획득 사유 기록';

create index idx_user_objects_user on public.user_objects(user_id);
create index idx_user_objects_acquired on public.user_objects(acquired_at desc);

-- =====================================================
-- 12. SPACES (사용자 공간 구성)
-- =====================================================
-- 사용자의 시즌별 공간과 오브젝트 배치 정보

create table public.spaces (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  season_id uuid not null references public.seasons(id) on delete cascade,
  name varchar(100),                      -- 공간 이름 (사용자 지정)
  is_public boolean default true,         -- 공개 여부

  -- 오브젝트 배치 정보 (JSON)
  layout jsonb default '[]'::jsonb,
  -- layout 구조: [{ "object_id": "uuid", "x": 100, "y": 200, "scale": 1.0, "rotation": 0, "z_index": 1 }, ...]

  background_variant varchar(50),         -- 배경 변형 (색상, 스타일 등)
  last_edited_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,

  unique(user_id, season_id)
);

comment on table public.spaces is '사용자별 시즌 공간';
comment on column public.spaces.layout is '오브젝트 배치 정보 JSON 배열';

create index idx_spaces_user on public.spaces(user_id);
create index idx_spaces_user_season on public.spaces(user_id, season_id);
create index idx_spaces_public on public.spaces(is_public) where is_public = true;

-- =====================================================
-- 13. FRIENDSHIPS (친구 관계)
-- =====================================================
-- 팔로우/팔로잉 방식의 친구 관계

create table public.friendships (
  id uuid primary key default uuid_generate_v4(),
  follower_id uuid not null references public.users(id) on delete cascade,  -- 팔로우하는 사람
  following_id uuid not null references public.users(id) on delete cascade, -- 팔로우 받는 사람
  status varchar(20) default 'active',    -- 상태 (active, blocked)
  created_at timestamptz default now() not null,

  unique(follower_id, following_id),
  check (follower_id != following_id)     -- 자기 자신 팔로우 방지
);

comment on table public.friendships is '친구(팔로우) 관계';
comment on column public.friendships.follower_id is '팔로우하는 사용자';
comment on column public.friendships.following_id is '팔로우 받는 사용자';

create index idx_friendships_follower on public.friendships(follower_id) where status = 'active';
create index idx_friendships_following on public.friendships(following_id) where status = 'active';

-- =====================================================
-- 14. SPACE_VISITS (공간 방문 기록)
-- =====================================================
-- 친구 공간 방문 기록

create table public.space_visits (
  id uuid primary key default uuid_generate_v4(),
  visitor_id uuid not null references public.users(id) on delete cascade,
  space_id uuid not null references public.spaces(id) on delete cascade,
  visited_at timestamptz default now() not null
);

comment on table public.space_visits is '공간 방문 기록';

create index idx_space_visits_visitor on public.space_visits(visitor_id);
create index idx_space_visits_space on public.space_visits(space_id);
create index idx_space_visits_recent on public.space_visits(visited_at desc);

-- =====================================================
-- 15. NOTIFICATIONS (알림)
-- =====================================================
-- 사용자 알림 (일일 질문, 친구 요청, 방문 알림 등)

create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  type varchar(30) not null,              -- 알림 타입
  title varchar(100) not null,
  message text,
  data jsonb,                             -- 추가 데이터
  is_read boolean default false,
  read_at timestamptz,
  created_at timestamptz default now() not null
);

comment on table public.notifications is '사용자 알림';
comment on column public.notifications.type is 'daily_question, friend_request, space_visit, object_acquired 등';

create index idx_notifications_user on public.notifications(user_id);
create index idx_notifications_unread on public.notifications(user_id, is_read) where is_read = false;
create index idx_notifications_created on public.notifications(created_at desc);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Updated_at 자동 업데이트 함수
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 각 테이블에 updated_at 트리거 적용
create trigger trigger_users_updated_at
  before update on public.users
  for each row execute function update_updated_at_column();

create trigger trigger_seasons_updated_at
  before update on public.seasons
  for each row execute function update_updated_at_column();

create trigger trigger_axis_definitions_updated_at
  before update on public.axis_definitions
  for each row execute function update_updated_at_column();

create trigger trigger_questions_updated_at
  before update on public.questions
  for each row execute function update_updated_at_column();

create trigger trigger_user_seasons_updated_at
  before update on public.user_seasons
  for each row execute function update_updated_at_column();

create trigger trigger_axis_scores_updated_at
  before update on public.axis_scores
  for each row execute function update_updated_at_column();

create trigger trigger_objects_updated_at
  before update on public.objects
  for each row execute function update_updated_at_column();

create trigger trigger_spaces_updated_at
  before update on public.spaces
  for each row execute function update_updated_at_column();

-- 축 점수 평균 자동 계산 함수
create or replace function calculate_axis_average()
returns trigger as $$
begin
  if new.answer_count > 0 then
    new.average_score = round((new.total_score::decimal / new.answer_count), 2);
  else
    new.average_score = null;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trigger_axis_scores_average
  before insert or update of total_score, answer_count on public.axis_scores
  for each row execute function calculate_axis_average();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.seasons enable row level security;
alter table public.axis_definitions enable row level security;
alter table public.questions enable row level security;
alter table public.question_choices enable row level security;
alter table public.answers enable row level security;
alter table public.user_seasons enable row level security;
alter table public.axis_scores enable row level security;
alter table public.object_categories enable row level security;
alter table public.objects enable row level security;
alter table public.user_objects enable row level security;
alter table public.spaces enable row level security;
alter table public.friendships enable row level security;
alter table public.space_visits enable row level security;
alter table public.notifications enable row level security;

-- =====================================================
-- USERS policies
-- =====================================================
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can view public profiles"
  on public.users for select
  using (is_public = true and deleted_at is null);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

-- =====================================================
-- SEASONS policies (공개 데이터)
-- =====================================================
create policy "Anyone can view seasons"
  on public.seasons for select
  using (true);

-- =====================================================
-- AXIS_DEFINITIONS policies (공개 데이터)
-- =====================================================
create policy "Anyone can view axis definitions"
  on public.axis_definitions for select
  using (true);

-- =====================================================
-- QUESTIONS policies (공개 데이터)
-- =====================================================
create policy "Anyone can view questions"
  on public.questions for select
  using (true);

-- =====================================================
-- QUESTION_CHOICES policies (공개 데이터)
-- =====================================================
create policy "Anyone can view question choices"
  on public.question_choices for select
  using (true);

-- =====================================================
-- ANSWERS policies
-- =====================================================
create policy "Users can view own answers"
  on public.answers for select
  using (auth.uid() = user_id);

create policy "Users can insert own answers"
  on public.answers for insert
  with check (auth.uid() = user_id);

create policy "Users can update own answers"
  on public.answers for update
  using (auth.uid() = user_id);

-- =====================================================
-- USER_SEASONS policies
-- =====================================================
create policy "Users can view own seasons"
  on public.user_seasons for select
  using (auth.uid() = user_id);

create policy "Users can insert own seasons"
  on public.user_seasons for insert
  with check (auth.uid() = user_id);

create policy "Users can update own seasons"
  on public.user_seasons for update
  using (auth.uid() = user_id);

-- =====================================================
-- AXIS_SCORES policies
-- =====================================================
create policy "Users can view own axis scores"
  on public.axis_scores for select
  using (auth.uid() = user_id);

create policy "Users can view friend axis scores"
  on public.axis_scores for select
  using (
    exists (
      select 1 from public.friendships
      where follower_id = auth.uid()
      and following_id = user_id
      and status = 'active'
    )
  );

create policy "Users can manage own axis scores"
  on public.axis_scores for all
  using (auth.uid() = user_id);

-- =====================================================
-- OBJECT_CATEGORIES policies (공개 데이터)
-- =====================================================
create policy "Anyone can view object categories"
  on public.object_categories for select
  using (true);

-- =====================================================
-- OBJECTS policies (공개 데이터)
-- =====================================================
create policy "Anyone can view objects"
  on public.objects for select
  using (true);

-- =====================================================
-- USER_OBJECTS policies
-- =====================================================
create policy "Users can view own objects"
  on public.user_objects for select
  using (auth.uid() = user_id);

create policy "Users can view friend objects"
  on public.user_objects for select
  using (
    exists (
      select 1 from public.friendships
      where follower_id = auth.uid()
      and following_id = user_id
      and status = 'active'
    )
  );

create policy "Users can manage own objects"
  on public.user_objects for all
  using (auth.uid() = user_id);

-- =====================================================
-- SPACES policies
-- =====================================================
create policy "Users can view own spaces"
  on public.spaces for select
  using (auth.uid() = user_id);

create policy "Users can view public spaces"
  on public.spaces for select
  using (is_public = true);

create policy "Users can view friend spaces"
  on public.spaces for select
  using (
    exists (
      select 1 from public.friendships
      where follower_id = auth.uid()
      and following_id = user_id
      and status = 'active'
    )
  );

create policy "Users can manage own spaces"
  on public.spaces for all
  using (auth.uid() = user_id);

-- =====================================================
-- FRIENDSHIPS policies
-- =====================================================
create policy "Users can view own friendships"
  on public.friendships for select
  using (auth.uid() = follower_id or auth.uid() = following_id);

create policy "Users can follow others"
  on public.friendships for insert
  with check (auth.uid() = follower_id);

create policy "Users can unfollow"
  on public.friendships for delete
  using (auth.uid() = follower_id);

create policy "Users can update own follows"
  on public.friendships for update
  using (auth.uid() = follower_id or auth.uid() = following_id);

-- =====================================================
-- SPACE_VISITS policies
-- =====================================================
create policy "Users can view visits to own spaces"
  on public.space_visits for select
  using (
    exists (
      select 1 from public.spaces
      where spaces.id = space_id
      and spaces.user_id = auth.uid()
    )
  );

create policy "Users can view own visits"
  on public.space_visits for select
  using (auth.uid() = visitor_id);

create policy "Users can record visits"
  on public.space_visits for insert
  with check (auth.uid() = visitor_id);

-- =====================================================
-- NOTIFICATIONS policies
-- =====================================================
create policy "Users can view own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

create policy "Users can delete own notifications"
  on public.notifications for delete
  using (auth.uid() = user_id);

-- =====================================================
-- HELPER VIEWS
-- =====================================================

-- 상호 팔로우(친구) 관계 뷰
create or replace view public.mutual_friends as
select
  f1.follower_id as user_id,
  f1.following_id as friend_id,
  f1.created_at as friendship_started_at
from public.friendships f1
inner join public.friendships f2
  on f1.follower_id = f2.following_id
  and f1.following_id = f2.follower_id
where f1.status = 'active' and f2.status = 'active';

comment on view public.mutual_friends is '상호 팔로우 관계 (진정한 친구)';

-- 사용자별 축 점수 요약 뷰
create or replace view public.user_axis_summary as
select
  uas.user_id,
  uas.season_id,
  s.name as season_name,
  ad.axis_code,
  ad.name as axis_name,
  ad.low_end_name,
  ad.high_end_name,
  uas.average_score,
  uas.final_score
from public.axis_scores uas
join public.axis_definitions ad on ad.id = uas.axis_id
join public.seasons s on s.id = uas.season_id
order by uas.user_id, uas.season_id, ad.axis_order;

comment on view public.user_axis_summary is '사용자별 축 점수 요약';

-- =====================================================
-- GRANTS
-- =====================================================
-- Supabase의 기본 역할에 대한 권한 설정

grant usage on schema public to anon, authenticated;

grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;

grant usage, select on all sequences in schema public to anon, authenticated;

grant select on public.mutual_friends to authenticated;
grant select on public.user_axis_summary to authenticated;
