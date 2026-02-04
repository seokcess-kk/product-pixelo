'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'

const REACTIONS = [
  { emoji: 'heart', icon: '❤️', label: '좋아요' },
  { emoji: 'fire', icon: '🔥', label: '멋져요' },
  { emoji: 'star', icon: '⭐', label: '최고예요' },
  { emoji: 'clap', icon: '👏', label: '응원해요' },
  { emoji: 'smile', icon: '😊', label: '힐링' },
]

interface ReactionButtonProps {
  onReact: (emoji: string) => Promise<void>
  disabled?: boolean
}

export function ReactionButton({ onReact, disabled = false }: ReactionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleReact = async (emoji: string) => {
    setIsLoading(true)
    try {
      await onReact(emoji)
      setSelectedEmoji(emoji)
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to react:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectedReaction = REACTIONS.find((r) => r.emoji === selectedEmoji)

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || isLoading}
      >
        {selectedReaction ? (
          <span className="flex items-center gap-2">
            <span>{selectedReaction.icon}</span>
            <span>{selectedReaction.label}</span>
          </span>
        ) : (
          '반응 남기기'
        )}
      </Button>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 animate-scale-in">
          <div className="flex gap-1 rounded-lg border bg-background p-2 shadow-lg">
            {REACTIONS.map((reaction) => (
              <button
                key={reaction.emoji}
                onClick={() => handleReact(reaction.emoji)}
                className="flex flex-col items-center rounded-lg p-2 transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={isLoading}
                aria-label={reaction.label}
              >
                <span className="text-2xl">{reaction.icon}</span>
                <span className="mt-1 text-[10px] text-muted-foreground">
                  {reaction.label}
                </span>
              </button>
            ))}
          </div>
          {/* Arrow */}
          <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r bg-background" />
        </div>
      )}
    </div>
  )
}
