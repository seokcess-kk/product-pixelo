'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

// =============================================================================
// Types
// =============================================================================

interface EditToolbarProps {
  isEditMode: boolean
  hasChanges: boolean
  canUndo: boolean
  isSaving: boolean
  onEditToggle: () => void
  onUndo: () => void
  onSave: () => void
  className?: string
}

// =============================================================================
// Main Component
// =============================================================================

export function EditToolbar({
  isEditMode,
  hasChanges,
  canUndo,
  isSaving,
  onEditToggle,
  onUndo,
  onSave,
  className,
}: EditToolbarProps) {
  if (!isEditMode) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Button variant="outline" size="sm" onClick={onEditToggle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1.5"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
          </svg>
          편집
        </Button>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg border bg-card p-2 shadow-sm',
        className
      )}
    >
      {/* 닫기 버튼 */}
      <Button variant="ghost" size="icon" onClick={onEditToggle}>
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
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
        <span className="sr-only">편집 종료</span>
      </Button>

      <div className="h-6 w-px bg-border" />

      {/* 편집 모드 표시 */}
      <span className="text-sm font-medium text-muted-foreground">
        편집 모드
      </span>

      <div className="flex-1" />

      {/* Undo 버튼 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onUndo}
        disabled={!canUndo}
        className="gap-1.5"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 7v6h6" />
          <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
        </svg>
        되돌리기
      </Button>

      {/* 저장 버튼 */}
      <Button
        size="sm"
        onClick={onSave}
        disabled={!hasChanges || isSaving}
        className="gap-1.5"
      >
        {isSaving ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            저장 중...
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            저장
          </>
        )}
      </Button>
    </div>
  )
}
