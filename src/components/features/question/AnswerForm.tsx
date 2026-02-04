'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'

interface AnswerFormProps {
  onSubmit: (content: string) => Promise<void>
  isLoading?: boolean
}

export function AnswerForm({ onSubmit, isLoading = false }: AnswerFormProps) {
  const [content, setContent] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || isLoading) return
    await onSubmit(content)
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="오늘의 답변을 적어주세요..."
        className="min-h-[200px] resize-none"
        disabled={isLoading}
      />
      <Button
        type="submit"
        className="w-full"
        disabled={!content.trim() || isLoading}
      >
        {isLoading ? '저장 중...' : '답변 저장하기'}
      </Button>
    </form>
  )
}
