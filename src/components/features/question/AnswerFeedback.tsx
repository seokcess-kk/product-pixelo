'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { AcquiredObject } from '@/types/questions'

interface AnswerFeedbackProps {
  isVisible: boolean
  axisChange?: {
    axisName: string
    scoreValue: number
  }
  acquiredObject?: AcquiredObject
  onComplete: () => void
}

export function AnswerFeedback({
  isVisible,
  axisChange,
  acquiredObject,
  onComplete,
}: AnswerFeedbackProps) {
  const [stage, setStage] = useState<'check' | 'axis' | 'object' | 'done'>('check')

  useEffect(() => {
    if (!isVisible) {
      setStage('check')
      return
    }

    // Stage progression
    const timers: NodeJS.Timeout[] = []

    // Show check mark first
    timers.push(setTimeout(() => {
      if (axisChange) {
        setStage('axis')
      } else if (acquiredObject) {
        setStage('object')
      } else {
        setStage('done')
        onComplete()
      }
    }, 500))

    // Show axis change
    if (axisChange) {
      timers.push(setTimeout(() => {
        if (acquiredObject) {
          setStage('object')
        } else {
          setStage('done')
          onComplete()
        }
      }, 1200))
    }

    // Show object acquisition
    if (acquiredObject) {
      const objectDelay = axisChange ? 2000 : 1000
      timers.push(setTimeout(() => {
        setStage('done')
      }, objectDelay))

      timers.push(setTimeout(() => {
        onComplete()
      }, objectDelay + 1500))
    }

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [isVisible, axisChange, acquiredObject, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-pixel-black/30',
          'transition-opacity duration-300',
          isVisible ? 'opacity-100' : 'opacity-0',
        )}
      />

      {/* Check Mark Animation */}
      {stage === 'check' && (
        <div className="animate-scale-in">
          <div className="w-24 h-24 bg-success border-4 border-pixel-black shadow-pixel flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white animate-pixel-bounce"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={4}
              strokeLinecap="square"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
      )}

      {/* Axis Score Change */}
      {stage === 'axis' && axisChange && (
        <div className="animate-slide-up">
          <div className="bg-pixel-white border-4 border-pixel-black shadow-pixel p-6 text-center">
            <p className="font-pixel text-pixel-caption text-muted-foreground mb-2">
              {axisChange.axisName}
            </p>
            <p className="font-pixel text-pixel-heading text-primary-600">
              {axisChange.scoreValue > 0 ? '+' : ''}{axisChange.scoreValue}
            </p>
          </div>
        </div>
      )}

      {/* Object Acquisition */}
      {stage === 'object' && acquiredObject && (
        <ObjectAcquisitionModal object={acquiredObject} />
      )}
    </div>
  )
}

interface ObjectAcquisitionModalProps {
  object: AcquiredObject
}

function ObjectAcquisitionModal({ object }: ObjectAcquisitionModalProps) {
  return (
    <div className="animate-scale-in pointer-events-auto">
      <div className="relative bg-pixel-white border-4 border-pixel-black shadow-pixel p-8 text-center max-w-sm mx-4">
        {/* Header */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-pixel-gold text-pixel-black font-pixel text-pixel-caption border-2 border-pixel-black animate-pixel-blink">
            NEW OBJECT!
          </span>
        </div>

        {/* Object Image */}
        <div className="w-32 h-32 mx-auto mb-4 bg-gray-100 border-4 border-pixel-black flex items-center justify-center overflow-hidden">
          {object.imageUrl ? (
            <img
              src={object.imageUrl}
              alt={object.name}
              className="w-full h-full object-contain pixel-render"
            />
          ) : (
            <div className="w-16 h-16 bg-primary-200 animate-float" />
          )}
        </div>

        {/* Object Name */}
        <h3 className="font-pixel text-pixel-subhead text-foreground mb-2">
          {object.name}
        </h3>

        {/* Acquisition Reason */}
        <p className="font-sans text-sm text-muted-foreground">
          {object.reason}
        </p>

        {/* Sparkles */}
        <Sparkles />
      </div>
    </div>
  )
}

function Sparkles() {
  const sparkles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 0.5,
    size: 4 + Math.random() * 4,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute bg-pixel-star animate-[sparkle_1s_ease-out_forwards]"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: sparkle.size,
            height: sparkle.size,
            animationDelay: `${sparkle.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
