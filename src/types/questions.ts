/**
 * Question API Types
 * 질문/응답 API에서 사용되는 타입 정의
 */

// =====================================================
// Database Row Types (DB 스키마와 1:1 매핑)
// =====================================================

export interface QuestionRow {
  id: string
  season_id: string
  day_number: number
  question_text: string
  question_type: string
  created_at: string
  updated_at: string
}

export interface QuestionChoiceRow {
  id: string
  question_id: string
  choice_order: number
  choice_text: string
  axis_id: string
  score_value: number
  created_at: string
}

export interface AnswerRow {
  id: string
  user_id: string
  question_id: string
  choice_id: string
  answered_at: string
}

export interface AxisDefinitionRow {
  id: string
  season_id: string
  axis_code: string
  axis_order: number
  name: string
  name_en: string | null
  low_end_name: string
  high_end_name: string
  low_end_description: string | null
  high_end_description: string | null
  icon_url: string | null
  created_at: string
  updated_at: string
}

export interface AxisScoreRow {
  id: string
  user_id: string
  season_id: string
  axis_id: string
  total_score: number
  answer_count: number
  average_score: number | null
  final_score: number | null
  created_at: string
  updated_at: string
}

export interface UserSeasonRow {
  id: string
  user_id: string
  season_id: string
  current_day: number
  is_completed: boolean
  started_at: string
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface SeasonRow {
  id: string
  season_number: number
  name: string
  description: string | null
  space_type: string
  space_background_url: string | null
  total_questions: number
  total_days: number
  is_active: boolean
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
}

export interface ObjectRow {
  id: string
  season_id: string
  category_id: string
  name: string
  description: string | null
  image_url: string
  thumbnail_url: string | null
  axis_id: string | null
  min_score: number | null
  max_score: number | null
  default_x: number
  default_y: number
  width: number | null
  height: number | null
  is_movable: boolean
  is_resizable: boolean
  acquisition_type: 'axis_score' | 'day' | 'default'
  acquisition_day: number | null
  created_at: string
  updated_at: string
}

export interface UserObjectRow {
  id: string
  user_id: string
  object_id: string
  acquired_at: string
  acquired_reason: string | null
}

// =====================================================
// API Response Types (클라이언트에 반환되는 형태)
// =====================================================

export interface QuestionChoice {
  id: string
  order: number
  text: string
}

export interface TodayQuestion {
  id: string
  dayNumber: number
  questionText: string
  questionType: string
  choices: QuestionChoice[]
}

export interface TodayQuestionsResponse {
  seasonId: string
  seasonName: string
  questions: TodayQuestion[]
  progress: {
    currentDay: number
    totalDays: number
  }
}

export interface AnswerResponse {
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

export interface AcquiredObject {
  id: string
  name: string
  imageUrl: string
  thumbnailUrl: string | null
  reason: string
}

export interface ProgressResponse {
  seasonId: string
  seasonName: string
  currentDay: number
  totalDays: number
  isCompleted: boolean
  answeredCount: number
  progressPercentage: number
  axisScores: AxisScoreSummary[]
}

export interface AxisScoreSummary {
  axisCode: string
  axisName: string
  lowEndName: string
  highEndName: string
  answerCount: number
  averageScore: number | null
  finalScore: number | null
}

export interface QuestionDetailResponse {
  id: string
  seasonId: string
  dayNumber: number
  questionText: string
  questionType: string
  choices: QuestionChoiceDetail[]
  userAnswer: UserAnswerInfo | null
}

export interface QuestionChoiceDetail {
  id: string
  order: number
  text: string
  axisInfo: {
    axisCode: string
    axisName: string
    scoreDirection: 'low' | 'high' | 'middle'
  }
}

export interface UserAnswerInfo {
  answerId: string
  choiceId: string
  answeredAt: string
}

// =====================================================
// API Request Types (클라이언트에서 보내는 요청)
// =====================================================

export interface AnswerRequest {
  questionId: string
  choiceId: string
}
