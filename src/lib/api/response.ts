import { NextResponse } from 'next/server'
import { ApiError, ErrorCodes } from './errors'
import { ZodError } from 'zod'

/**
 * API Response Types
 */
export interface ApiSuccessResponse<T> {
  data: T
}

export interface ApiErrorResponse {
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export interface PaginatedData<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

/**
 * 성공 응답 생성
 */
export function successResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json({ data }, { status })
}

/**
 * 생성 성공 응답 (201)
 */
export function createdResponse<T>(data: T): NextResponse {
  return successResponse(data, 201)
}

/**
 * 삭제 성공 응답 (204)
 */
export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 })
}

/**
 * 에러 응답 생성
 */
export function errorResponse(
  code: string,
  message: string,
  status: number = 500,
  details?: unknown
): NextResponse {
  const response: ApiErrorResponse = {
    error: {
      code,
      message,
      ...(details && { details }),
    },
  }
  return NextResponse.json(response, { status })
}

/**
 * 에러 핸들러
 * try-catch에서 발생한 에러를 적절한 응답으로 변환
 */
export function handleError(error: unknown): NextResponse {
  // ApiError 처리
  if (error instanceof ApiError) {
    return errorResponse(error.code, error.message, error.status, error.details)
  }

  // Zod 유효성 검증 에러 처리
  if (error instanceof ZodError) {
    const formattedErrors = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }))
    return errorResponse(
      ErrorCodes.VALIDATION_ERROR,
      '입력 데이터가 유효하지 않습니다.',
      400,
      formattedErrors
    )
  }

  // 일반 Error 처리
  if (error instanceof Error) {
    console.error('Unexpected error:', error)
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      '서버 오류가 발생했습니다.',
      500
    )
  }

  // 알 수 없는 에러
  console.error('Unknown error:', error)
  return errorResponse(
    ErrorCodes.INTERNAL_ERROR,
    '알 수 없는 오류가 발생했습니다.',
    500
  )
}
