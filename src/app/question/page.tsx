'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  QuestionCard,
  AnswerForm,
  AnswerFeedback,
  QuestionIntro,
  QuestionComplete,
  QuestionAlreadyComplete,
  LoadingQuestion,
  ErrorQuestion,
} from '@/components/features/question'
import { useTodayQuestions } from '@/hooks'
import type { AnswerResponse } from '@/types/questions'

type PageState = 'loading' | 'error' | 'intro' | 'question' | 'feedback' | 'complete' | 'already-complete'

export default function QuestionPage() {
  const router = useRouter()

  // State
  const [pageState, setPageState] = useState<PageState>('loading')
  const [lastAnswer, setLastAnswer] = useState<AnswerResponse | null>(null)

  // Hook
  const {
    questions,
    currentQuestionIndex,
    currentQuestion,
    progress,
    acquiredObjects,
    axisScores,
    isLoading,
    isSubmitting,
    error,
    isComplete,
    hasQuestions,
    fetchQuestions,
    submitAnswer,
    nextQuestion,
  } = useTodayQuestions({
    autoFetch: true,
  })

  // Determine page state based on data
  const determineState = useCallback(() => {
    if (isLoading) {
      setPageState('loading')
    } else if (error) {
      setPageState('error')
    } else if (!hasQuestions && progress.currentDay > 0) {
      setPageState('already-complete')
    } else if (!hasQuestions) {
      // No questions yet - show intro with 0 questions (edge case)
      setPageState('intro')
    } else if (isComplete) {
      setPageState('complete')
    } else if (currentQuestionIndex === 0 && pageState === 'loading') {
      setPageState('intro')
    }
  }, [isLoading, error, hasQuestions, progress.currentDay, isComplete, currentQuestionIndex, pageState])

  // Initial state determination
  useState(() => {
    if (!isLoading && pageState === 'loading') {
      determineState()
    }
  })

  // Watch for loading complete
  if (!isLoading && pageState === 'loading') {
    if (error) {
      setPageState('error')
    } else if (!hasQuestions && progress.currentDay > 0) {
      setPageState('already-complete')
    } else if (!hasQuestions) {
      setPageState('intro')
    } else {
      setPageState('intro')
    }
  }

  // Handlers
  const handleStart = () => {
    setPageState('question')
  }

  const handleSelectAnswer = async (choiceId: string) => {
    const result = await submitAnswer(choiceId)

    if (result) {
      setLastAnswer(result)
      setPageState('feedback')
    }
  }

  const handleFeedbackComplete = () => {
    setLastAnswer(null)

    if (currentQuestionIndex + 1 >= questions.length) {
      // All questions answered
      setPageState('complete')
    } else {
      // Move to next question
      nextQuestion()
      setPageState('question')
    }
  }

  const handleRetry = () => {
    fetchQuestions()
    setPageState('loading')
  }

  const handleGoHome = () => {
    router.push('/')
  }

  const handleGoToSpace = () => {
    router.push('/space')
  }

  // Render based on state
  switch (pageState) {
    case 'loading':
      return (
        <main className="min-h-screen bg-background">
          <LoadingQuestion />
        </main>
      )

    case 'error':
      return (
        <main className="min-h-screen bg-background">
          <ErrorQuestion
            message={error || '알 수 없는 오류가 발생했습니다.'}
            onRetry={handleRetry}
            onGoHome={handleGoHome}
          />
        </main>
      )

    case 'intro':
      return (
        <main className="min-h-screen bg-background">
          <QuestionIntro
            questionCount={questions.length}
            onStart={handleStart}
            isLoading={isLoading}
          />
        </main>
      )

    case 'question':
      if (!currentQuestion) {
        return (
          <main className="min-h-screen bg-background">
            <LoadingQuestion message="질문을 준비하는 중..." />
          </main>
        )
      }

      return (
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            {/* Close button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={handleGoHome}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="닫기"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Question Card */}
            <div className="mb-8">
              <QuestionCard
                question={currentQuestion}
                currentIndex={currentQuestionIndex}
                totalCount={questions.length}
              />
            </div>

            {/* Answer Form */}
            <AnswerForm
              choices={currentQuestion.choices}
              onSelect={handleSelectAnswer}
              isLoading={isSubmitting}
            />
          </div>

          {/* Feedback overlay */}
          <AnswerFeedback
            isVisible={pageState === 'feedback'}
            axisChange={lastAnswer?.axisScore ? {
              axisName: lastAnswer.axisScore.axisName,
              scoreValue: lastAnswer.axisScore.scoreValue,
            } : undefined}
            acquiredObject={lastAnswer?.acquiredObjects?.[0]}
            onComplete={handleFeedbackComplete}
          />
        </main>
      )

    case 'feedback':
      // Render question page with feedback overlay
      if (!currentQuestion) {
        return (
          <main className="min-h-screen bg-background">
            <LoadingQuestion />
          </main>
        )
      }

      return (
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8 opacity-30">
            <div className="mb-8">
              <QuestionCard
                question={currentQuestion}
                currentIndex={currentQuestionIndex}
                totalCount={questions.length}
              />
            </div>
            <AnswerForm
              choices={currentQuestion.choices}
              onSelect={() => Promise.resolve()}
              disabled
            />
          </div>

          <AnswerFeedback
            isVisible={true}
            axisChange={lastAnswer?.axisScore ? {
              axisName: lastAnswer.axisScore.axisName,
              scoreValue: lastAnswer.axisScore.scoreValue,
            } : undefined}
            acquiredObject={lastAnswer?.acquiredObjects?.[0]}
            onComplete={handleFeedbackComplete}
          />
        </main>
      )

    case 'complete':
      return (
        <main className="min-h-screen bg-background">
          <QuestionComplete
            axisScores={axisScores}
            acquiredObjects={acquiredObjects}
            onGoToSpace={handleGoToSpace}
            onGoHome={handleGoHome}
          />
        </main>
      )

    case 'already-complete':
      return (
        <main className="min-h-screen bg-background">
          <QuestionAlreadyComplete
            currentDay={progress.currentDay}
            totalDays={progress.totalDays}
            onGoHome={handleGoHome}
          />
        </main>
      )

    default:
      return null
  }
}
