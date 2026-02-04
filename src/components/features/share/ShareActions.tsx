'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface ShareActionsProps {
  shareUrl: string
  onSaveImage?: () => Promise<void>
}

export function ShareActions({ shareUrl, onSaveImage }: ShareActionsProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleSaveImage = async () => {
    if (!onSaveImage) return
    setIsSaving(true)
    try {
      await onSaveImage()
    } catch (error) {
      console.error('Failed to save image:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {onSaveImage && (
        <Button onClick={handleSaveImage} disabled={isSaving}>
          {isSaving ? '저장 중...' : '이미지 저장하기'}
        </Button>
      )}
      <Button variant="outline" onClick={handleCopyLink}>
        {isCopied ? '복사됨!' : '링크 복사하기'}
      </Button>
    </div>
  )
}
