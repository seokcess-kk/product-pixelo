-- =====================================================
-- PIXELO MVP - Seed Data
-- =====================================================
-- Initial data for seasons, axis definitions, object categories,
-- sample questions, and objects
-- =====================================================

-- =====================================================
-- 1. OBJECT CATEGORIES (오브젝트 카테고리)
-- =====================================================

insert into public.object_categories (code, name, layer_order) values
  ('background', '배경', 1),
  ('floor', '바닥', 2),
  ('wall_deco', '벽 장식', 3),
  ('large_furniture', '대형 가구', 4),
  ('medium_furniture', '중형 가구', 5),
  ('small_furniture', '소형 가구', 6),
  ('accessory', '소품', 7),
  ('plant', '식물', 8),
  ('lighting', '조명', 9),
  ('character', '캐릭터/인형', 10);

-- =====================================================
-- 2. SEASONS (시즌 데이터)
-- =====================================================

insert into public.seasons (
  season_number,
  name,
  description,
  space_type,
  space_background_url,
  total_questions,
  total_days,
  is_active,
  start_date
) values
(
  1,
  '나의 방',
  '24일간의 질문에 답하며 나만의 방을 완성해보세요. 매일 한 가지 질문에 답하면 당신의 성향을 반영한 오브젝트를 획득할 수 있습니다.',
  'room',
  '/images/spaces/room-base.png',
  24,
  24,
  true,
  '2025-01-01'
),
(
  2,
  '나의 아지트',
  '나만의 비밀 아지트를 꾸며보세요. 시즌 2에서는 더 다양한 오브젝트와 새로운 질문들이 기다리고 있습니다.',
  'hideout',
  '/images/spaces/hideout-base.png',
  24,
  24,
  false,
  null
);

-- =====================================================
-- 3. AXIS DEFINITIONS (7개 측정축 정의)
-- =====================================================

-- 시즌 1의 축 정의
with season1 as (
  select id from public.seasons where season_number = 1
)
insert into public.axis_definitions (
  season_id,
  axis_code,
  axis_order,
  name,
  name_en,
  low_end_name,
  high_end_name,
  low_end_description,
  high_end_description
)
select
  season1.id,
  axis_data.code,
  axis_data.order_num,
  axis_data.name,
  axis_data.name_en,
  axis_data.low_name,
  axis_data.high_name,
  axis_data.low_desc,
  axis_data.high_desc
from season1,
(values
  ('energy', 1, '에너지 방향', 'Energy Direction',
   '내향', '외향',
   '혼자만의 시간에서 에너지를 충전하고, 깊은 생각과 내면의 세계를 중시합니다.',
   '사람들과의 교류에서 에너지를 얻고, 활발한 소통과 외부 활동을 즐깁니다.'),

  ('lifestyle', 2, '생활 패턴', 'Lifestyle Pattern',
   '루틴', '즉흥',
   '계획적이고 규칙적인 일상을 선호하며, 안정적인 패턴 속에서 편안함을 느낍니다.',
   '즉흥적이고 자유로운 일상을 선호하며, 변화와 새로움에서 활력을 얻습니다.'),

  ('emotion', 3, '감성 스타일', 'Emotional Style',
   '이성', '감성',
   '논리적이고 분석적인 사고를 선호하며, 객관적인 판단을 중시합니다.',
   '감정과 직관을 중시하며, 공감 능력이 뛰어나고 분위기에 민감합니다.'),

  ('aesthetic', 4, '미적 취향', 'Aesthetic Preference',
   '미니멀', '맥시멀',
   '간결하고 깔끔한 것을 선호하며, 필요한 것만 두는 정돈된 공간을 좋아합니다.',
   '풍성하고 다채로운 것을 선호하며, 개성 있는 아이템들로 가득 찬 공간을 좋아합니다.'),

  ('social', 5, '사회적 성향', 'Social Tendency',
   '개인', '협력',
   '독립적으로 일하는 것을 선호하며, 자신만의 방식으로 목표를 달성합니다.',
   '함께 협력하는 것을 선호하며, 팀워크를 통해 더 큰 성과를 추구합니다.'),

  ('challenge', 6, '도전 성향', 'Challenge Attitude',
   '안정', '모험',
   '익숙하고 안전한 것을 선호하며, 신중하게 결정을 내립니다.',
   '새로운 도전을 즐기며, 위험을 감수하더라도 새로운 경험을 추구합니다.'),

  ('relationship', 7, '관계 방식', 'Relationship Style',
   '깊은 관계', '넓은 관계',
   '소수의 사람들과 깊고 의미 있는 관계를 선호합니다.',
   '다양한 사람들과 폭넓은 관계를 맺는 것을 선호합니다.')
) as axis_data(code, order_num, name, name_en, low_name, high_name, low_desc, high_desc);

-- 시즌 2의 축 정의 (동일한 축, 다른 시즌)
with season2 as (
  select id from public.seasons where season_number = 2
)
insert into public.axis_definitions (
  season_id,
  axis_code,
  axis_order,
  name,
  name_en,
  low_end_name,
  high_end_name,
  low_end_description,
  high_end_description
)
select
  season2.id,
  axis_data.code,
  axis_data.order_num,
  axis_data.name,
  axis_data.name_en,
  axis_data.low_name,
  axis_data.high_name,
  axis_data.low_desc,
  axis_data.high_desc
from season2,
(values
  ('energy', 1, '에너지 방향', 'Energy Direction', '내향', '외향', null, null),
  ('lifestyle', 2, '생활 패턴', 'Lifestyle Pattern', '루틴', '즉흥', null, null),
  ('emotion', 3, '감성 스타일', 'Emotional Style', '이성', '감성', null, null),
  ('aesthetic', 4, '미적 취향', 'Aesthetic Preference', '미니멀', '맥시멀', null, null),
  ('social', 5, '사회적 성향', 'Social Tendency', '개인', '협력', null, null),
  ('challenge', 6, '도전 성향', 'Challenge Attitude', '안정', '모험', null, null),
  ('relationship', 7, '관계 방식', 'Relationship Style', '깊은 관계', '넓은 관계', null, null)
) as axis_data(code, order_num, name, name_en, low_name, high_name, low_desc, high_desc);

-- =====================================================
-- 4. SAMPLE QUESTIONS (시즌 1 - 24개 질문)
-- =====================================================

-- 시즌 1 질문 생성
with season1 as (
  select id from public.seasons where season_number = 1
)
insert into public.questions (season_id, day_number, question_text, question_type)
select season1.id, q.day, q.text, 'single_choice'
from season1,
(values
  -- Day 1-4: 에너지 방향 (내향-외향)
  (1, '주말 아침, 눈을 떴을 때 가장 하고 싶은 것은?'),
  (2, '새로운 카페에 갔을 때, 어떤 자리를 선택하나요?'),
  (3, '친구의 생일 파티에서 당신은 보통 어떤 역할인가요?'),
  (4, '스트레스를 받았을 때 주로 어떻게 해소하나요?'),

  -- Day 5-8: 생활 패턴 (루틴-즉흥)
  (5, '여행 계획을 세울 때 당신의 스타일은?'),
  (6, '일요일 저녁, 내일을 위해 당신은?'),
  (7, '갑자기 시간이 비었을 때 당신은?'),
  (8, '새해 목표를 세울 때 당신의 방식은?'),

  -- Day 9-11: 감성 스타일 (이성-감성)
  (9, '영화를 고를 때 주로 어떤 기준으로 선택하나요?'),
  (10, '친구가 고민을 털어놓았을 때 당신의 반응은?'),
  (11, '중요한 결정을 내릴 때 가장 의지하는 것은?'),

  -- Day 12-14: 미적 취향 (미니멀-맥시멀)
  (12, '이상적인 방의 모습은?'),
  (13, '옷장을 정리할 때 당신의 스타일은?'),
  (14, '선물을 고를 때 주로 어떤 것을 선택하나요?'),

  -- Day 15-17: 사회적 성향 (개인-협력)
  (15, '프로젝트를 진행할 때 선호하는 방식은?'),
  (16, '문제가 생겼을 때 당신의 해결 방식은?'),
  (17, '성취감을 느끼는 순간은?'),

  -- Day 18-20: 도전 성향 (안정-모험)
  (18, '새로운 음식점을 발견했을 때 당신은?'),
  (19, '커리어에 대한 당신의 생각은?'),
  (20, '익숙한 것과 새로운 것 사이에서 당신은?'),

  -- Day 21-24: 관계 방식 (깊은 관계-넓은 관계)
  (21, '친구 관계에서 가장 중요하게 생각하는 것은?'),
  (22, '모임에서 새로운 사람을 만났을 때 당신은?'),
  (23, '연락을 주고받는 당신만의 패턴은?'),
  (24, '이상적인 관계의 모습은?')
) as q(day, text);

-- =====================================================
-- 5. QUESTION CHOICES (질문별 선택지)
-- =====================================================

-- 축 ID를 변수로 사용하기 위한 CTE
with
season1 as (select id from public.seasons where season_number = 1),
axes as (
  select
    ad.id,
    ad.axis_code
  from public.axis_definitions ad
  join season1 s on s.id = ad.season_id
),
questions_cte as (
  select q.id, q.day_number
  from public.questions q
  join season1 s on s.id = q.season_id
)
insert into public.question_choices (question_id, choice_order, choice_text, axis_id, score_value)
select
  q.id,
  c.choice_order,
  c.choice_text,
  a.id,
  c.score_value
from questions_cte q
cross join lateral (
  values
    -- Day 1: 에너지 방향
    (1, 1, '침대에서 뒹굴며 책을 읽거나 영상을 본다', 'energy', 1),
    (1, 2, '조용한 카페에서 혼자만의 시간을 보낸다', 'energy', 2),
    (1, 3, '친구에게 연락해서 브런치 약속을 잡는다', 'energy', 4),
    (1, 4, '활기찬 장소로 나가 사람들 속에서 에너지를 얻는다', 'energy', 5),

    -- Day 2: 에너지 방향
    (2, 1, '구석의 조용한 1인 좌석', 'energy', 1),
    (2, 2, '창가의 2인 테이블', 'energy', 2),
    (2, 3, '중앙의 편안한 소파석', 'energy', 4),
    (2, 4, '바 테이블이나 커뮤니티 테이블', 'energy', 5),

    -- Day 3: 에너지 방향
    (3, 1, '조용히 구석에서 친한 친구와 대화를 나눈다', 'energy', 1),
    (3, 2, '필요할 때만 대화에 참여하고 관찰을 즐긴다', 'energy', 2),
    (3, 3, '자연스럽게 여러 그룹을 돌아다니며 대화한다', 'energy', 4),
    (3, 4, '파티의 중심에서 분위기를 이끈다', 'energy', 5),

    -- Day 4: 에너지 방향
    (4, 1, '혼자 조용한 공간에서 명상이나 독서를 한다', 'energy', 1),
    (4, 2, '산책이나 혼자 하는 운동으로 머리를 식힌다', 'energy', 2),
    (4, 3, '친한 친구에게 연락해서 이야기를 나눈다', 'energy', 4),
    (4, 4, '사람들과 어울리며 기분 전환을 한다', 'energy', 5),

    -- Day 5: 생활 패턴
    (5, 1, '분 단위로 상세한 일정을 세운다', 'lifestyle', 1),
    (5, 2, '핵심 장소만 정해두고 융통성 있게 움직인다', 'lifestyle', 2),
    (5, 3, '큰 방향만 정하고 현지에서 정보를 얻는다', 'lifestyle', 4),
    (5, 4, '계획 없이 발길 닿는 대로 간다', 'lifestyle', 5),

    -- Day 6: 생활 패턴
    (6, 1, '내일 입을 옷과 가방을 미리 준비한다', 'lifestyle', 1),
    (6, 2, '할 일 목록을 간단히 정리한다', 'lifestyle', 2),
    (6, 3, '알람만 맞춰두고 아침에 생각한다', 'lifestyle', 4),
    (6, 4, '특별히 준비하지 않고 그때그때 해결한다', 'lifestyle', 5),

    -- Day 7: 생활 패턴
    (7, 1, '미리 정해둔 할 일 목록에서 하나를 꺼낸다', 'lifestyle', 1),
    (7, 2, '평소 하고 싶었던 것을 찾아서 한다', 'lifestyle', 2),
    (7, 3, '그 순간 끌리는 것을 바로 시작한다', 'lifestyle', 4),
    (7, 4, '즉흥적으로 밖으로 나가 뭔가를 찾는다', 'lifestyle', 5),

    -- Day 8: 생활 패턴
    (8, 1, '구체적인 목표와 달성 계획을 세운다', 'lifestyle', 1),
    (8, 2, '몇 가지 키워드로 방향을 정한다', 'lifestyle', 2),
    (8, 3, '큰 그림만 그리고 유연하게 접근한다', 'lifestyle', 4),
    (8, 4, '특별한 목표 없이 흘러가는 대로 산다', 'lifestyle', 5),

    -- Day 9: 감성 스타일
    (9, 1, '평점과 리뷰를 꼼꼼히 분석한다', 'emotion', 1),
    (9, 2, '줄거리와 장르를 확인해서 논리적으로 판단한다', 'emotion', 2),
    (9, 3, '포스터나 예고편의 분위기가 끌리면 선택한다', 'emotion', 4),
    (9, 4, '그날 기분과 감정에 맞는 것을 직감으로 고른다', 'emotion', 5),

    -- Day 10: 감성 스타일
    (10, 1, '문제 상황을 분석하고 해결책을 제안한다', 'emotion', 1),
    (10, 2, '객관적인 시각에서 조언을 해준다', 'emotion', 2),
    (10, 3, '먼저 공감하고 감정을 나눈다', 'emotion', 4),
    (10, 4, '함께 울거나 웃으며 감정을 공유한다', 'emotion', 5),

    -- Day 11: 감성 스타일
    (11, 1, '데이터와 팩트를 기반으로 분석한다', 'emotion', 1),
    (11, 2, '장단점 목록을 만들어 비교한다', 'emotion', 2),
    (11, 3, '마음이 가는 방향을 먼저 느껴본다', 'emotion', 4),
    (11, 4, '직감과 느낌을 가장 신뢰한다', 'emotion', 5),

    -- Day 12: 미적 취향
    (12, 1, '필요한 것만 있는 깔끔하고 비어 있는 공간', 'aesthetic', 1),
    (12, 2, '정돈되어 있지만 몇 가지 포인트가 있는 공간', 'aesthetic', 2),
    (12, 3, '개성 있는 소품들로 채워진 아기자기한 공간', 'aesthetic', 4),
    (12, 4, '다양한 물건들이 가득한 풍성한 공간', 'aesthetic', 5),

    -- Day 13: 미적 취향
    (13, 1, '안 입는 옷은 과감하게 비우고 최소한만 남긴다', 'aesthetic', 1),
    (13, 2, '필수 아이템 위주로 정리하되 여유 공간을 둔다', 'aesthetic', 2),
    (13, 3, '다양한 스타일을 위해 여러 옷을 보관한다', 'aesthetic', 4),
    (13, 4, '모든 옷을 소중히 여기며 가득 채워둔다', 'aesthetic', 5),

    -- Day 14: 미적 취향
    (14, 1, '실용적이고 꼭 필요한 것', 'aesthetic', 1),
    (14, 2, '심플하지만 품질 좋은 것', 'aesthetic', 2),
    (14, 3, '개성 있고 특별한 의미가 있는 것', 'aesthetic', 4),
    (14, 4, '화려하고 인상적인 것', 'aesthetic', 5),

    -- Day 15: 사회적 성향
    (15, 1, '혼자서 처음부터 끝까지 책임지고 싶다', 'social', 1),
    (15, 2, '역할을 나누되 각자 독립적으로 진행한다', 'social', 2),
    (15, 3, '수시로 의견을 나누며 함께 방향을 정한다', 'social', 4),
    (15, 4, '팀 전체가 모여 모든 것을 함께 결정한다', 'social', 5),

    -- Day 16: 사회적 성향
    (16, 1, '혼자 고민하며 해결책을 찾는다', 'social', 1),
    (16, 2, '필요한 정보만 얻고 스스로 해결한다', 'social', 2),
    (16, 3, '주변에 의견을 물어보며 함께 고민한다', 'social', 4),
    (16, 4, '여러 사람과 함께 브레인스토밍한다', 'social', 5),

    -- Day 17: 사회적 성향
    (17, 1, '혼자서 목표를 달성했을 때', 'social', 1),
    (17, 2, '내 노력이 인정받았을 때', 'social', 2),
    (17, 3, '팀과 함께 성과를 냈을 때', 'social', 4),
    (17, 4, '모두가 함께 기뻐할 수 있을 때', 'social', 5),

    -- Day 18: 도전 성향
    (18, 1, '일단 지나치고 다음에 리뷰를 확인한 후 간다', 'challenge', 1),
    (18, 2, '검색해서 정보를 충분히 얻은 후 방문한다', 'challenge', 2),
    (18, 3, '메뉴판을 보고 괜찮으면 들어가 본다', 'challenge', 4),
    (18, 4, '바로 들어가서 새로운 경험을 즐긴다', 'challenge', 5),

    -- Day 19: 도전 성향
    (19, 1, '안정적인 곳에서 꾸준히 성장하고 싶다', 'challenge', 1),
    (19, 2, '기반을 다진 후 조금씩 도전하고 싶다', 'challenge', 2),
    (19, 3, '성장을 위해 적극적으로 기회를 찾는다', 'challenge', 4),
    (19, 4, '새로운 도전을 위해 과감하게 변화를 선택한다', 'challenge', 5),

    -- Day 20: 도전 성향
    (20, 1, '익숙한 것의 편안함을 더 좋아한다', 'challenge', 1),
    (20, 2, '익숙한 것을 기반으로 조금씩 변화를 준다', 'challenge', 2),
    (20, 3, '새로운 것에 흥미를 느끼지만 신중하게 접근한다', 'challenge', 4),
    (20, 4, '새로운 것에 대한 설렘이 항상 이긴다', 'challenge', 5),

    -- Day 21: 관계 방식
    (21, 1, '서로를 깊이 이해하는 진정성', 'relationship', 1),
    (21, 2, '오랜 시간 함께한 신뢰', 'relationship', 2),
    (21, 3, '다양한 경험을 함께 나누는 것', 'relationship', 4),
    (21, 4, '폭넓은 네트워크와 다양한 연결', 'relationship', 5),

    -- Day 22: 관계 방식
    (22, 1, '가볍게 인사만 하고 깊은 대화는 다음 기회에', 'relationship', 1),
    (22, 2, '공통 관심사를 찾아 의미 있는 대화를 시도한다', 'relationship', 2),
    (22, 3, '적극적으로 연락처를 교환하고 만남을 이어간다', 'relationship', 4),
    (22, 4, '많은 사람들과 활발하게 교류한다', 'relationship', 5),

    -- Day 23: 관계 방식
    (23, 1, '소수의 친구에게 깊은 대화를 담아 연락한다', 'relationship', 1),
    (23, 2, '가까운 사람들과 자주, 긴 대화를 나눈다', 'relationship', 2),
    (23, 3, '다양한 사람들과 가볍지만 꾸준히 연락한다', 'relationship', 4),
    (23, 4, 'SNS나 그룹채팅으로 많은 사람들과 소통한다', 'relationship', 5),

    -- Day 24: 관계 방식
    (24, 1, '소수의 소울메이트와 깊은 유대', 'relationship', 1),
    (24, 2, '믿을 수 있는 친밀한 친구 그룹', 'relationship', 2),
    (24, 3, '다양한 그룹의 여러 친구들', 'relationship', 4),
    (24, 4, '넓고 다양한 인맥 네트워크', 'relationship', 5)
) as c(day, choice_order, choice_text, axis_code, score_value)
join axes a on a.axis_code = c.axis_code
where q.day_number = c.day;

-- =====================================================
-- 6. OBJECTS (오브젝트 데이터)
-- =====================================================

-- 시즌 1 오브젝트
with
season1 as (select id from public.seasons where season_number = 1),
categories as (
  select id, code from public.object_categories
),
axes as (
  select ad.id, ad.axis_code
  from public.axis_definitions ad
  join season1 s on s.id = ad.season_id
)
insert into public.objects (
  season_id,
  category_id,
  name,
  description,
  image_url,
  thumbnail_url,
  axis_id,
  min_score,
  max_score,
  acquisition_type,
  acquisition_day,
  default_x,
  default_y,
  width,
  height,
  is_movable
)
select
  s.id as season_id,
  c.id as category_id,
  o.name,
  o.description,
  o.image_url,
  o.thumbnail_url,
  a.id as axis_id,
  o.min_score,
  o.max_score,
  o.acquisition_type,
  o.acquisition_day,
  o.default_x,
  o.default_y,
  o.width,
  o.height,
  o.is_movable
from season1 s
cross join lateral (
  values
    -- 기본 제공 오브젝트 (배경)
    ('background', '기본 방 배경', '시작할 때 제공되는 기본 방 배경입니다.', '/images/objects/room-bg-default.png', '/images/objects/thumbs/room-bg-default.png', null, null, null, 'default', null, 0, 0, 800, 600, false),

    -- 에너지 방향 축 오브젝트 (내향 1-2 / 외향 4-5)
    ('small_furniture', '아늑한 독서 의자', '혼자만의 시간을 위한 편안한 의자', '/images/objects/reading-chair.png', '/images/objects/thumbs/reading-chair.png', 'energy', 1, 2, 'axis_score', null, 100, 300, 120, 150, true),
    ('accessory', '무드등', '은은한 조명의 무드등', '/images/objects/mood-lamp.png', '/images/objects/thumbs/mood-lamp.png', 'energy', 1, 2, 'axis_score', null, 50, 100, 60, 80, true),
    ('plant', '작은 화분', '조용히 함께하는 작은 식물', '/images/objects/small-plant.png', '/images/objects/thumbs/small-plant.png', 'energy', 1, 2, 'axis_score', null, 200, 150, 50, 70, true),

    ('medium_furniture', '파티 테이블', '친구들과 함께하기 좋은 테이블', '/images/objects/party-table.png', '/images/objects/thumbs/party-table.png', 'energy', 4, 5, 'axis_score', null, 300, 350, 200, 120, true),
    ('lighting', '화려한 조명', '파티 분위기의 밝은 조명', '/images/objects/bright-light.png', '/images/objects/thumbs/bright-light.png', 'energy', 4, 5, 'axis_score', null, 400, 50, 100, 100, true),
    ('accessory', '블루투스 스피커', '신나는 음악을 위한 스피커', '/images/objects/speaker.png', '/images/objects/thumbs/speaker.png', 'energy', 4, 5, 'axis_score', null, 500, 200, 80, 100, true),

    -- 생활 패턴 축 오브젝트 (루틴 1-2 / 즉흥 4-5)
    ('wall_deco', '달력', '계획을 위한 큰 달력', '/images/objects/calendar.png', '/images/objects/thumbs/calendar.png', 'lifestyle', 1, 2, 'axis_score', null, 600, 50, 120, 150, true),
    ('accessory', '알람 시계', '규칙적인 일상을 위한 시계', '/images/objects/alarm-clock.png', '/images/objects/thumbs/alarm-clock.png', 'lifestyle', 1, 2, 'axis_score', null, 250, 80, 60, 60, true),
    ('small_furniture', '정리함', '깔끔하게 정리된 수납함', '/images/objects/organizer.png', '/images/objects/thumbs/organizer.png', 'lifestyle', 1, 2, 'axis_score', null, 150, 250, 100, 120, true),

    ('accessory', '여행 가방', '언제든 떠날 준비가 된 가방', '/images/objects/travel-bag.png', '/images/objects/thumbs/travel-bag.png', 'lifestyle', 4, 5, 'axis_score', null, 350, 400, 100, 80, true),
    ('wall_deco', '세계 지도', '다음 목적지를 꿈꾸는 지도', '/images/objects/world-map.png', '/images/objects/thumbs/world-map.png', 'lifestyle', 4, 5, 'axis_score', null, 450, 30, 200, 150, true),
    ('accessory', '폴라로이드 카메라', '순간을 담는 즉흥 카메라', '/images/objects/polaroid.png', '/images/objects/thumbs/polaroid.png', 'lifestyle', 4, 5, 'axis_score', null, 280, 120, 70, 80, true),

    -- 감성 스타일 축 오브젝트 (이성 1-2 / 감성 4-5)
    ('accessory', '노트북', '분석과 작업을 위한 노트북', '/images/objects/laptop.png', '/images/objects/thumbs/laptop.png', 'emotion', 1, 2, 'axis_score', null, 200, 280, 100, 80, true),
    ('small_furniture', '책꽂이', '지식을 담은 미니 책꽂이', '/images/objects/bookshelf-mini.png', '/images/objects/thumbs/bookshelf-mini.png', 'emotion', 1, 2, 'axis_score', null, 50, 200, 80, 150, true),
    ('wall_deco', '화이트보드', '아이디어를 정리하는 보드', '/images/objects/whiteboard.png', '/images/objects/thumbs/whiteboard.png', 'emotion', 1, 2, 'axis_score', null, 550, 80, 150, 120, true),

    ('accessory', '캔들', '분위기를 만드는 향초', '/images/objects/candle.png', '/images/objects/thumbs/candle.png', 'emotion', 4, 5, 'axis_score', null, 320, 150, 50, 70, true),
    ('wall_deco', '감성 포스터', '마음을 담은 아트 포스터', '/images/objects/art-poster.png', '/images/objects/thumbs/art-poster.png', 'emotion', 4, 5, 'axis_score', null, 400, 20, 100, 140, true),
    ('accessory', '일기장', '감정을 기록하는 다이어리', '/images/objects/diary.png', '/images/objects/thumbs/diary.png', 'emotion', 4, 5, 'axis_score', null, 180, 320, 60, 80, true),

    -- 미적 취향 축 오브젝트 (미니멀 1-2 / 맥시멀 4-5)
    ('medium_furniture', '심플 데스크', '깔끔한 라인의 미니멀 책상', '/images/objects/simple-desk.png', '/images/objects/thumbs/simple-desk.png', 'aesthetic', 1, 2, 'axis_score', null, 300, 300, 180, 100, true),
    ('small_furniture', '모던 의자', '군더더기 없는 의자', '/images/objects/modern-chair.png', '/images/objects/thumbs/modern-chair.png', 'aesthetic', 1, 2, 'axis_score', null, 350, 280, 80, 100, true),
    ('plant', '미니멀 화분', '심플한 디자인의 화분', '/images/objects/minimal-plant.png', '/images/objects/thumbs/minimal-plant.png', 'aesthetic', 1, 2, 'axis_score', null, 500, 350, 60, 80, true),

    ('wall_deco', '갤러리 월', '다양한 액자로 가득한 벽', '/images/objects/gallery-wall.png', '/images/objects/thumbs/gallery-wall.png', 'aesthetic', 4, 5, 'axis_score', null, 200, 30, 250, 180, true),
    ('accessory', '빈티지 소품들', '개성 있는 빈티지 소품 세트', '/images/objects/vintage-items.png', '/images/objects/thumbs/vintage-items.png', 'aesthetic', 4, 5, 'axis_score', null, 450, 280, 120, 100, true),
    ('plant', '정글 화분', '풍성한 열대 식물', '/images/objects/jungle-plant.png', '/images/objects/thumbs/jungle-plant.png', 'aesthetic', 4, 5, 'axis_score', null, 100, 350, 100, 150, true),

    -- 사회적 성향 축 오브젝트 (개인 1-2 / 협력 4-5)
    ('small_furniture', '1인 소파', '나만의 공간을 위한 소파', '/images/objects/single-sofa.png', '/images/objects/thumbs/single-sofa.png', 'social', 1, 2, 'axis_score', null, 200, 350, 120, 100, true),
    ('accessory', '헤드폰', '집중을 위한 노이즈캔슬링 헤드폰', '/images/objects/headphones.png', '/images/objects/thumbs/headphones.png', 'social', 1, 2, 'axis_score', null, 280, 100, 60, 70, true),
    ('wall_deco', '개인 작업 보드', '나만의 프로젝트 보드', '/images/objects/personal-board.png', '/images/objects/thumbs/personal-board.png', 'social', 1, 2, 'axis_score', null, 500, 50, 120, 150, true),

    ('large_furniture', '대형 소파', '여럿이 앉을 수 있는 소파', '/images/objects/large-sofa.png', '/images/objects/thumbs/large-sofa.png', 'social', 4, 5, 'axis_score', null, 250, 380, 220, 120, true),
    ('accessory', '보드게임 세트', '함께 즐기는 보드게임', '/images/objects/board-games.png', '/images/objects/thumbs/board-games.png', 'social', 4, 5, 'axis_score', null, 350, 320, 100, 80, true),
    ('medium_furniture', '커뮤니티 테이블', '모두가 둘러앉는 원형 테이블', '/images/objects/round-table.png', '/images/objects/thumbs/round-table.png', 'social', 4, 5, 'axis_score', null, 400, 350, 150, 100, true),

    -- 도전 성향 축 오브젝트 (안정 1-2 / 모험 4-5)
    ('accessory', '안락한 담요', '편안함을 주는 담요', '/images/objects/cozy-blanket.png', '/images/objects/thumbs/cozy-blanket.png', 'challenge', 1, 2, 'axis_score', null, 220, 400, 100, 60, true),
    ('plant', '다육이 세트', '관리하기 쉬운 다육 식물', '/images/objects/succulents.png', '/images/objects/thumbs/succulents.png', 'challenge', 1, 2, 'axis_score', null, 480, 300, 80, 60, true),
    ('wall_deco', '가족 사진', '소중한 추억을 담은 사진', '/images/objects/family-photo.png', '/images/objects/thumbs/family-photo.png', 'challenge', 1, 2, 'axis_score', null, 600, 100, 100, 120, true),

    ('accessory', '등산 장비', '새로운 도전을 위한 장비', '/images/objects/hiking-gear.png', '/images/objects/thumbs/hiking-gear.png', 'challenge', 4, 5, 'axis_score', null, 100, 420, 100, 80, true),
    ('wall_deco', '모험 지도', '탐험했던 곳을 표시한 지도', '/images/objects/adventure-map.png', '/images/objects/thumbs/adventure-map.png', 'challenge', 4, 5, 'axis_score', null, 300, 20, 180, 130, true),
    ('accessory', '스노클링 장비', '바다 탐험 장비', '/images/objects/snorkel.png', '/images/objects/thumbs/snorkel.png', 'challenge', 4, 5, 'axis_score', null, 550, 400, 80, 60, true),

    -- 관계 방식 축 오브젝트 (깊은 관계 1-2 / 넓은 관계 4-5)
    ('accessory', '커플 머그컵', '소중한 사람과의 페어 머그', '/images/objects/couple-mugs.png', '/images/objects/thumbs/couple-mugs.png', 'relationship', 1, 2, 'axis_score', null, 320, 250, 70, 60, true),
    ('wall_deco', '베스트프렌드 액자', '절친과의 추억 사진', '/images/objects/bestfriend-frame.png', '/images/objects/thumbs/bestfriend-frame.png', 'relationship', 1, 2, 'axis_score', null, 550, 80, 80, 100, true),
    ('accessory', '편지 세트', '마음을 담은 손편지 도구', '/images/objects/letter-set.png', '/images/objects/thumbs/letter-set.png', 'relationship', 1, 2, 'axis_score', null, 180, 180, 60, 50, true),

    ('wall_deco', '단체 사진 월', '다양한 친구들과의 사진', '/images/objects/group-photos.png', '/images/objects/thumbs/group-photos.png', 'relationship', 4, 5, 'axis_score', null, 150, 30, 200, 150, true),
    ('accessory', '명함 홀더', '다양한 인맥의 명함', '/images/objects/card-holder.png', '/images/objects/thumbs/card-holder.png', 'relationship', 4, 5, 'axis_score', null, 420, 200, 60, 50, true),
    ('accessory', '파티 소품들', '모임을 위한 파티 용품', '/images/objects/party-items.png', '/images/objects/thumbs/party-items.png', 'relationship', 4, 5, 'axis_score', null, 480, 380, 120, 80, true),

    -- 일차별 획득 오브젝트 (특별 보상)
    ('character', 'Day 1 웰컴 인형', '첫날을 축하하는 작은 인형', '/images/objects/welcome-plush.png', '/images/objects/thumbs/welcome-plush.png', null, null, null, 'day', 1, 400, 300, 80, 100, true),
    ('accessory', '1주 완료 트로피', '첫 주를 완료한 기념품', '/images/objects/week1-trophy.png', '/images/objects/thumbs/week1-trophy.png', null, null, null, 'day', 7, 350, 150, 60, 80, true),
    ('wall_deco', '2주 완료 배너', '반환점 통과 축하 배너', '/images/objects/week2-banner.png', '/images/objects/thumbs/week2-banner.png', null, null, null, 'day', 14, 250, 10, 150, 80, true),
    ('accessory', '3주 완료 메달', '거의 다 왔어요!', '/images/objects/week3-medal.png', '/images/objects/thumbs/week3-medal.png', null, null, null, 'day', 21, 420, 180, 50, 60, true),
    ('character', '시즌 완료 마스코트', '시즌 1 완료 축하 마스코트', '/images/objects/season-complete.png', '/images/objects/thumbs/season-complete.png', null, null, null, 'day', 24, 450, 350, 120, 150, true)

) as o(category_code, name, description, image_url, thumbnail_url, axis_code, min_score, max_score, acquisition_type, acquisition_day, default_x, default_y, width, height, is_movable)
join categories c on c.code = o.category_code
left join axes a on a.axis_code = o.axis_code;

-- =====================================================
-- VERIFY SEED DATA
-- =====================================================

-- 시즌 확인
select 'Seasons:' as info, count(*) as count from public.seasons;

-- 축 정의 확인
select 'Axis Definitions:' as info, count(*) as count from public.axis_definitions;

-- 질문 확인
select 'Questions:' as info, count(*) as count from public.questions;

-- 선택지 확인
select 'Question Choices:' as info, count(*) as count from public.question_choices;

-- 오브젝트 카테고리 확인
select 'Object Categories:' as info, count(*) as count from public.object_categories;

-- 오브젝트 확인
select 'Objects:' as info, count(*) as count from public.objects;

-- 축별 오브젝트 수 확인
select
  coalesce(ad.axis_code, 'special') as axis,
  count(*) as object_count
from public.objects o
left join public.axis_definitions ad on ad.id = o.axis_id
group by ad.axis_code
order by axis;
