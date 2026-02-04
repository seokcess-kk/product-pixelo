// =====================================================
// Score Calculator Types (re-export)
// =====================================================
export {
  AxisCode,
  ALL_AXIS_CODES,
  AXIS_METADATA,
  SCORE_RANGES,
  type AnswerData,
  type AxisScoreData,
  type AllScoresResult,
  type ScoreRangeLabel,
} from '@/lib/score-calculator'

// =====================================================
// Object Mapper Types (re-export)
// =====================================================
export {
  ObjectCategory as ObjectCategoryCode,
  SpaceType,
  AcquisitionType,
  type PixelObject,
  type AcquiredObject,
  type SpaceLayout,
} from '@/lib/object-mapper'

// User Types
export interface UserProfile {
  id: string
  userId: string
  nickname: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

// Question Types
export interface Question {
  id: string
  content: string
  category: QuestionCategory
  seasonId: string
  order: number
  createdAt: string
}

export const QuestionCategory = {
  SELF: 'self',
  EMOTION: 'emotion',
  MEMORY: 'memory',
  DREAM: 'dream',
  RELATIONSHIP: 'relationship',
} as const

export type QuestionCategory = (typeof QuestionCategory)[keyof typeof QuestionCategory]

// Answer Types
export interface Answer {
  id: string
  userId: string
  questionId: string
  content: string
  colorCode: string
  createdAt: string
}

// Space Types
export interface Season {
  id: string
  name: string
  startDate: string
  endDate: string
  gridSize: number
  isActive: boolean
}

export interface Pixel {
  id: string
  userId: string
  seasonId: string
  answerId: string
  x: number
  y: number
  colorCode: string
}

export interface Space {
  season: Season
  pixels: Pixel[]
}

// Social Types
export interface Friendship {
  id: string
  followerId: string
  followingId: string
  status: FriendshipStatus
  createdAt: string
}

export const FriendshipStatus = {
  ACTIVE: 'active',
  BLOCKED: 'blocked',
} as const

export type FriendshipStatus = (typeof FriendshipStatus)[keyof typeof FriendshipStatus]

// Friend with profile info (for API responses)
export interface FriendWithProfile {
  id: string
  nickname: string
  avatarUrl?: string
  bio?: string
  isPublic: boolean
  isMutual: boolean // 상호 팔로우 여부
  followedAt: string
}

// Following/Follower lists response
export interface FriendsListResponse {
  following: FriendWithProfile[]
  followers: FriendWithProfile[]
  mutualCount: number
}

// User search result
export interface UserSearchResult {
  id: string
  nickname: string
  avatarUrl?: string
  bio?: string
  isFollowing: boolean
  isFollower: boolean
}

// Friend's space (for visit)
export interface FriendSpace {
  id: string
  userId: string
  seasonId: string
  name?: string
  isPublic: boolean
  layout: ObjectPlacement[]
  backgroundVariant?: string
  lastEditedAt?: string
  user: {
    nickname: string
    avatarUrl?: string
  }
  season: {
    name: string
    spaceType: string
    spaceBackgroundUrl?: string
  }
  objects: SpaceObjectInfo[]
}

// Object info for space rendering
export interface SpaceObjectInfo {
  id: string
  name: string
  imageUrl: string
  thumbnailUrl?: string
  categoryCode: string
  layerOrder: number
  width?: number
  height?: number
}

// Axis score for comparison
export interface AxisScore {
  axisId: string
  axisCode: string
  axisName: string
  lowEndName: string
  highEndName: string
  averageScore?: number
  finalScore?: number
}

// Comparison data between two users
export interface ComparisonData {
  myScores: AxisScore[]
  friendScores: AxisScore[]
  similarities: {
    axisCode: string
    axisName: string
    scoreDifference: number
    isSimilar: boolean // difference <= 1
  }[]
  overallSimilarity: number // 0-100%
  friendInfo: {
    id: string
    nickname: string
    avatarUrl?: string
  }
}

// Legacy types (deprecated - kept for backward compatibility)
/** @deprecated Use Friendship instead */
export interface Friend {
  id: string
  userId: string
  friendId: string
  status: FriendStatus
  createdAt: string
}

/** @deprecated Use FriendshipStatus instead */
export const FriendStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  BLOCKED: 'blocked',
} as const

/** @deprecated Use FriendshipStatus instead */
export type FriendStatus = (typeof FriendStatus)[keyof typeof FriendStatus]

export interface Reaction {
  id: string
  userId: string
  targetUserId: string
  targetPixelId?: string
  emoji: string
  createdAt: string
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null
  error: ApiError | null
}

export interface ApiError {
  code: string
  message: string
  details?: unknown
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// =====================================================
// Auth Types
// =====================================================

export type OAuthProvider = 'kakao' | 'naver'

export const AuthErrorCode = {
  NOT_AUTHENTICATED: 'NOT_AUTHENTICATED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  PROFILE_NOT_FOUND: 'PROFILE_NOT_FOUND',
  PROFILE_EXISTS: 'PROFILE_EXISTS',
  NICKNAME_DUPLICATE: 'NICKNAME_DUPLICATE',
  NO_UPDATE_DATA: 'NO_UPDATE_DATA',
  LOGOUT_FAILED: 'LOGOUT_FAILED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  PROFILE_FETCH_ERROR: 'PROFILE_FETCH_ERROR',
  PROFILE_CREATE_ERROR: 'PROFILE_CREATE_ERROR',
  PROFILE_UPDATE_ERROR: 'PROFILE_UPDATE_ERROR',
} as const

export type AuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode]

export interface AuthUser {
  id: string
  email?: string
  provider?: string
  createdAt: string
}

export interface AuthMeResponse {
  user: AuthUser
  profile: UserProfile | null
  isNewUser: boolean
}

// =====================================================
// Space & Object Types (DB 스키마 기반)
// =====================================================

// 오브젝트 카테고리
export interface ObjectCategory {
  id: string
  code: string
  name: string
  layerOrder: number
}

// 오브젝트 메타데이터
export interface PixeloObject {
  id: string
  seasonId: string
  categoryId: string
  name: string
  description?: string
  imageUrl: string
  thumbnailUrl?: string
  axisId?: string
  minScore?: number
  maxScore?: number
  defaultX: number
  defaultY: number
  width?: number
  height?: number
  isMovable: boolean
  isResizable: boolean
  acquisitionType: 'axis_score' | 'day' | 'default'
  acquisitionDay?: number
  createdAt: string
  updatedAt: string
  // 조인된 데이터
  category?: ObjectCategory
}

// 사용자 획득 오브젝트
export interface UserObject {
  id: string
  userId: string
  objectId: string
  acquiredAt: string
  acquiredReason?: string
  // 조인된 데이터
  object?: PixeloObject
}

// 오브젝트 배치 정보 (layout JSON 내 개별 항목)
export interface ObjectPlacement {
  objectId: string
  x: number
  y: number
  scale: number
  rotation: number
  zIndex: number
}

// 사용자 공간
export interface UserSpace {
  id: string
  userId: string
  seasonId: string
  name?: string
  isPublic: boolean
  layout: ObjectPlacement[]
  backgroundVariant?: string
  lastEditedAt?: string
  createdAt: string
  updatedAt: string
  // 조인된 데이터
  season?: Season
}

// API 응답용 공간 정보
export interface SpaceWithObjects {
  space: UserSpace
  placedObjects: (ObjectPlacement & { object: PixeloObject })[]
  season: Season
}

// 인벤토리 아이템 (사용자 획득 오브젝트 + 배치 여부)
export interface InventoryItem {
  userObject: UserObject
  object: PixeloObject
  isPlaced: boolean
}

// =====================================================
// API Request/Response Types
// =====================================================

// 공간 수정 요청
export interface UpdateSpaceRequest {
  layout?: ObjectPlacement[]
  backgroundVariant?: string
  name?: string
  isPublic?: boolean
}

// 오브젝트 배치 요청
export interface PlaceObjectRequest {
  objectId: string
  seasonId: string
  x: number
  y: number
  scale?: number
  rotation?: number
  zIndex?: number
}

// 확장된 시즌 타입 (DB 스키마 기반)
export interface SeasonDetail extends Season {
  seasonNumber: number
  description?: string
  spaceType: string
  spaceBackgroundUrl?: string
  totalQuestions: number
  totalDays: number
}

// =====================================================
// Question API Types (re-export)
// =====================================================
export type {
  // Response types
  TodayQuestionsResponse,
  TodayQuestion,
  QuestionChoice,
  AnswerResponse,
  AcquiredObject as AcquiredObjectResponse,
  ProgressResponse,
  AxisScoreSummary,
  QuestionDetailResponse,
  QuestionChoiceDetail,
  UserAnswerInfo,
  // Request types
  AnswerRequest,
  // Database row types
  QuestionRow,
  QuestionChoiceRow,
  AnswerRow,
  AxisDefinitionRow,
  AxisScoreRow,
  UserSeasonRow,
  SeasonRow,
  ObjectRow,
  UserObjectRow,
} from './questions'

// =====================================================
// Share Types (re-export)
// =====================================================
export {
  ShareCardSize,
  SHARE_CARD_DIMENSIONS,
  AXIS_COLORS,
  type ShareCardData,
  type ShareOptions,
  type KakaoShareTemplateData,
  type AxisScoreSummary as ShareAxisScoreSummary,
} from './share'

// Explicitly re-export the AXIS_COLORS type for external use
export type { AxisScoreSummary as AxisScoreSummaryShare } from './share'
