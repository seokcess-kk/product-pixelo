/**
 * API Error Classes
 * API 에러 처리를 위한 클래스들
 */

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number = 500,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: unknown) {
    super('VALIDATION_ERROR', message, 400, details)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super('NOT_FOUND', `${resource}을(를) 찾을 수 없습니다.`, 404)
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = '인증이 필요합니다.') {
    super('UNAUTHORIZED', message, 401)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = '권한이 없습니다.') {
    super('FORBIDDEN', message, 403)
    this.name = 'ForbiddenError'
  }
}

export class ConflictError extends ApiError {
  constructor(message: string) {
    super('CONFLICT', message, 409)
    this.name = 'ConflictError'
  }
}

/**
 * 에러 코드 상수
 */
export const ErrorCodes = {
  // Authentication
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_FORMAT: 'INVALID_FORMAT',

  // Resources
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  ALREADY_ANSWERED: 'ALREADY_ANSWERED',

  // Business Logic
  SEASON_NOT_ACTIVE: 'SEASON_NOT_ACTIVE',
  QUESTION_NOT_AVAILABLE: 'QUESTION_NOT_AVAILABLE',

  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
} as const

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes]

// Space & Object specific error codes
export const SpaceErrorCodes = {
  INVALID_SEASON: 'INVALID_SEASON',
  SPACE_NOT_FOUND: 'SPACE_NOT_FOUND',
  OBJECT_NOT_OWNED: 'OBJECT_NOT_OWNED',
  OBJECT_ALREADY_PLACED: 'OBJECT_ALREADY_PLACED',
  INVALID_PLACEMENT: 'INVALID_PLACEMENT',
} as const
