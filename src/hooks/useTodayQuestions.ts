'use client'

import { useState, useCallback, useEffect } from 'react'
import type {
  TodayQuestionsResponse,
  TodayQuestion,
  AnswerResponse,
  ProgressResponse,
  AcquiredObject,
} from '@/types/questions'

interface UseTodayQuestionsOptions {
  autoFetch?: boolean
}

interface UseTodayQuestionsReturn {
  // Data
  questions: TodayQuestion[]
  currentQuestionIndex: number
  currentQuestion: TodayQuestion | null
  progress: { currentDay: number; totalDays: number }
  seasonName: string
  acquiredObjects: AcquiredObject[]
  axisScores: ProgressResponse['axisScores']

  // State
  isLoading: boolean
  isSubmitting: boolean
  error: string | null
  isComplete: boolean
  hasQuestions: boolean

  // Actions
  fetchQuestions: () => Promise<void>
  submitAnswer: (choiceId: string) => Promise<AnswerResponse | null>
  nextQuestion: () => void
  reset: () => void
}

/**
 * 오늘의 질문 관리 훅
 * - 질문 목록 조회
 * - 응답 제출
 * - 진행 상태 관리
 */
export function useTodayQuestions(
  options: UseTodayQuestionsOptions = {}
): UseTodayQuestionsReturn {
  const { autoFetch = true } = options

  // Data state
  const [questions, setQuestions] = useState<TodayQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [progress, setProgress] = useState({ currentDay: 0, totalDays: 0 })
  const [seasonName, setSeasonName] = useState('')
  const [acquiredObjects, setAcquiredObjects] = useState<AcquiredObject[]>([])
  const [axisScores, setAxisScores] = useState<ProgressResponse['axisScores']>([])

  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * 오늘의 질문 목록 조회
   */
  const fetchQuestions = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/questions/today')
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.message || '질문을 불러오는데 실패했습니다.')
      }

      const data = result.data as TodayQuestionsResponse

      setQuestions(data.questions)
      setProgress(data.progress)
      setSeasonName(data.seasonName)
      setCurrentQuestionIndex(0)
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * 응답 제출
   */
  const submitAnswer = useCallback(async (choiceId: string): Promise<AnswerResponse | null> => {
    const question = questions[currentQuestionIndex]
    if (!question) return null

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/questions/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.id,
          choiceId,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.message || '응답 저장에 실패했습니다.')
      }

      const data = result.data as AnswerResponse

      // Add acquired objects
      if (data.acquiredObjects && data.acquiredObjects.length > 0) {
        setAcquiredObjects((prev) => [...prev, ...data.acquiredObjects])
      }

      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      setError(message)
      return null
    } finally {
      setIsSubmitting(false)
    }
  }, [questions, currentQuestionIndex])

  /**
   * 다음 질문으로 이동
   */
  const nextQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length))
  }, [questions.length])

  /**
   * 진행률 조회
   */
  const fetchProgress = useCallback(async () => {
    try {
      const response = await fetch('/api/questions/progress')
      const result = await response.json()

      if (response.ok) {
        const data = result.data as ProgressResponse
        setProgress({
          currentDay: data.currentDay,
          totalDays: data.totalDays,
        })
        setAxisScores(data.axisScores)
      }
    } catch {
      // Silent fail for progress
    }
  }, [])

  /**
   * 상태 초기화
   */
  const reset = useCallback(() => {
    setQuestions([])
    setCurrentQuestionIndex(0)
    setAcquiredObjects([])
    setError(null)
  }, [])

  // Auto fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchQuestions()
    }
  }, [autoFetch, fetchQuestions])

  // Fetch progress when questions are complete
  const isComplete = currentQuestionIndex >= questions.length && questions.length > 0

  useEffect(() => {
    if (isComplete) {
      fetchProgress()
    }
  }, [isComplete, fetchProgress])

  return {
    // Data
    questions,
    currentQuestionIndex,
    currentQuestion: questions[currentQuestionIndex] || null,
    progress,
    seasonName,
    acquiredObjects,
    axisScores,

    // State
    isLoading,
    isSubmitting,
    error,
    isComplete,
    hasQuestions: questions.length > 0,

    // Actions
    fetchQuestions,
    submitAnswer,
    nextQuestion,
    reset,
  }
}
