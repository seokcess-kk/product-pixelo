'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { ShareCardSize } from '@/types/share'

// =============================================================================
// Types
// =============================================================================

interface ShareActionsProps {
  shareUrl: string
  onSaveImage?: (size: ShareCardSize) => Promise<void>
  onShareKakao?: () => Promise<void>
  className?: string
}

// =============================================================================
// Icons
// =============================================================================

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function KakaoIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M12 3c5.8 0 10.5 3.66 10.5 8.17 0 4.51-4.7 8.17-10.5 8.17-.89 0-1.75-.08-2.58-.24l-3.72 2.53a.5.5 0 0 1-.77-.54l.79-3.13C3.47 16.28 1.5 14.18 1.5 11.17 1.5 6.66 6.2 3 12 3z" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function ShareActions({
  shareUrl,
  onSaveImage,
  onShareKakao,
  className,
}: ShareActionsProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 링크 복사
  const handleCopyLink = useCallback(async () => {
    try {
      setError(null)
      await navigator.clipboard.writeText(shareUrl)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      setError('링크 복사에 실패했습니다.')
    }
  }, [shareUrl])

  // 이미지 저장
  const handleSaveImage = useCallback(async () => {
    if (!onSaveImage) return

    setIsSaving(true)
    setError(null)
    setSaveSuccess(false)

    try {
      // 기본 정사각형 크기로 저장
      await onSaveImage('square')
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    } catch (err) {
      setError('이미지 저장에 실패했습니다.')
    } finally {
      setIsSaving(false)
    }
  }, [onSaveImage])

  // 카카오 공유
  const handleShareKakao = useCallback(async () => {
    if (!onShareKakao) return

    setIsSharing(true)
    setError(null)

    try {
      await onShareKakao()
    } catch (err) {
      setError('카카오 공유에 실패했습니다.')
    } finally {
      setIsSharing(false)
    }
  }, [onShareKakao])

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* 에러 메시지 */}
      {error && (
        <div className="rounded-lg border border-error/20 bg-error-light px-4 py-2 text-sm text-error-dark">
          {error}
        </div>
      )}

      {/* 이미지 저장 버튼 */}
      {onSaveImage && (
        <Button
          onClick={handleSaveImage}
          disabled={isSaving}
          className="gap-2"
        >
          {isSaving ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              저장 중...
            </>
          ) : saveSuccess ? (
            <>
              <CheckIcon className="h-4 w-4" />
              저장 완료!
            </>
          ) : (
            <>
              <DownloadIcon className="h-4 w-4" />
              이미지 저장하기
            </>
          )}
        </Button>
      )}

      {/* 카카오 공유 버튼 */}
      {onShareKakao && (
        <Button
          onClick={handleShareKakao}
          disabled={isSharing}
          className="gap-2 bg-kakao text-pixel-black hover:bg-kakao/90"
        >
          {isSharing ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              공유 중...
            </>
          ) : (
            <>
              <KakaoIcon className="h-4 w-4" />
              카카오톡으로 공유
            </>
          )}
        </Button>
      )}

      {/* 링크 복사 버튼 */}
      <Button
        variant="outline"
        onClick={handleCopyLink}
        className="gap-2"
      >
        {isCopied ? (
          <>
            <CheckIcon className="h-4 w-4 text-success" />
            복사됨!
          </>
        ) : (
          <>
            <LinkIcon className="h-4 w-4" />
            링크 복사하기
          </>
        )}
      </Button>
    </div>
  )
}
