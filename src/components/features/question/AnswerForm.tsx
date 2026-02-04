'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { QuestionChoice } from '@/types/questions'

interface AnswerFormProps {
  choices: QuestionChoice[]
  onSelect: (choiceId: string) => Promise<void>
  isLoading?: boolean
  disabled?: boolean
}

export function AnswerForm({
  choices,
  onSelect,
  isLoading = false,
  disabled = false,
}: AnswerFormProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSelect = async (choiceId: string) => {
    if (isLoading || disabled || isSubmitting || selectedId) return

    setSelectedId(choiceId)
    setIsSubmitting(true)

    try {
      await onSelect(choiceId)
    } catch (error) {
      // Reset on error
      setSelectedId(null)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {choices.map((choice) => {
        const isSelected = selectedId === choice.id
        const isOther = selectedId !== null && selectedId !== choice.id

        return (
          <button
            key={choice.id}
            onClick={() => handleSelect(choice.id)}
            disabled={isLoading || disabled || isSubmitting}
            className={cn(
              'w-full p-5 text-left',
              'border-4 border-pixel-black',
              'font-sans text-base',
              'transition-all duration-150',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
              // Default state
              !selectedId && !isLoading && [
                'bg-white hover:bg-primary-50',
                'shadow-pixel hover:shadow-pixel-sm',
                'hover:-translate-y-0.5',
                'active:translate-x-0.5 active:translate-y-0.5 active:shadow-pixel-pressed',
              ],
              // Selected state
              isSelected && [
                'bg-primary-100 border-primary-600',
                'shadow-pixel-sm',
                'translate-x-0.5 translate-y-0.5',
                'animate-pulse',
              ],
              // Other (not selected) state
              isOther && [
                'bg-gray-100 border-gray-300',
                'opacity-50',
                'shadow-none',
              ],
              // Disabled/Loading state
              (isLoading || disabled) && [
                'cursor-not-allowed opacity-60',
              ],
            )}
          >
            <div className="flex items-center gap-4">
              {/* Choice indicator */}
              <div
                className={cn(
                  'flex-shrink-0 w-8 h-8',
                  'flex items-center justify-center',
                  'border-2 border-pixel-black',
                  'font-pixel text-pixel-caption',
                  isSelected
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-pixel-black',
                )}
              >
                {isSelected ? (
                  <CheckIcon className="w-4 h-4" />
                ) : (
                  String.fromCharCode(65 + choice.order - 1)
                )}
              </div>

              {/* Choice text */}
              <span
                className={cn(
                  'flex-1',
                  isSelected && 'font-medium text-primary-700',
                  isOther && 'text-gray-500',
                )}
              >
                {choice.text}
              </span>

              {/* Loading indicator for selected */}
              {isSelected && isSubmitting && (
                <div className="flex-shrink-0">
                  <LoadingDots />
                </div>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function LoadingDots() {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-primary-500 animate-[dot-bounce_1.4s_ease-in-out_infinite]"
          style={{
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  )
}
