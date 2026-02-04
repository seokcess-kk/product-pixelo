'use client'

import { useState } from 'react'

const REACTIONS = ['heart', 'fire', 'star', 'clap', 'smile']

interface ReactionButtonProps {
  onReact: (emoji: string) => Promise<void>
}

export function ReactionButton({ onReact }: ReactionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleReact = async (emoji: string) => {
    setIsLoading(true)
    try {
      await onReact(emoji)
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to react:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg border px-4 py-2 text-sm transition-colors hover:bg-muted"
        disabled={isLoading}
      >
        반응 남기기
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 flex gap-1 rounded-lg border bg-background p-2 shadow-lg">
          {REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReact(emoji)}
              className="rounded p-2 text-lg hover:bg-muted"
              disabled={isLoading}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
