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
export interface Friend {
  id: string
  userId: string
  friendId: string
  status: FriendStatus
  createdAt: string
}

export const FriendStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  BLOCKED: 'blocked',
} as const

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
