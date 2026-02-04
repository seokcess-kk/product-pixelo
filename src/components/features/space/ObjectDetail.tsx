'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import type { PixeloObject, UserObject } from '@/types'

// =============================================================================
// Types
// =============================================================================

interface ObjectDetailProps {
  object: PixeloObject
  userObject?: UserObject
  isPlaced?: boolean
  isEditMode?: boolean
  onClose: () => void
  onPlace?: () => void
  onRemove?: () => void
  onRotate?: () => void
}

// =============================================================================
// Main Component
// =============================================================================

export function ObjectDetail({
  object,
  userObject,
  isPlaced = false,
  isEditMode = false,
  onClose,
  onPlace,
  onRemove,
  onRotate,
}: ObjectDetailProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm animate-in fade-in zoom-in-95 rounded-lg bg-background p-6 shadow-lg duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">{object.name}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="닫기"
          >
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
          </button>
        </div>

        {/* 오브젝트 이미지 */}
        <div className="mx-auto mb-4 aspect-square w-40 overflow-hidden rounded-lg bg-muted">
          {object.imageUrl ? (
            <img
              src={object.imageUrl}
              alt={object.name}
              className="h-full w-full object-contain"
              style={{ imageRendering: 'pixelated' }}
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/40 text-4xl font-bold text-primary"
              style={{ imageRendering: 'pixelated' }}
            >
              {object.name.slice(0, 1)}
            </div>
          )}
        </div>

        {/* 설명 */}
        {object.description && (
          <p className="mb-4 text-center text-sm text-muted-foreground">
            "{object.description}"
          </p>
        )}

        {/* 정보 */}
        <div className="mb-4 space-y-2 rounded-lg bg-muted/50 p-3">
          {/* 카테고리 */}
          {object.category && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">카테고리</span>
              <span className="font-medium">{object.category.name}</span>
            </div>
          )}

          {/* 크기 */}
          {(object.width || object.height) && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">크기</span>
              <span className="font-medium">
                {object.width ?? 1} x {object.height ?? 1}
              </span>
            </div>
          )}

          {/* 획득일 */}
          {userObject?.acquiredAt && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">획득일</span>
              <span className="font-medium">
                {formatDate(userObject.acquiredAt, {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </span>
            </div>
          )}

          {/* 획득 이유 */}
          {userObject?.acquiredReason && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">획득 조건</span>
              <span className="font-medium">{userObject.acquiredReason}</span>
            </div>
          )}

          {/* 이동 가능 여부 */}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">이동</span>
            <span className="font-medium">
              {object.isMovable ? '가능' : '고정'}
            </span>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-2">
          {isEditMode ? (
            <>
              {/* 편집 모드 액션 */}
              {isPlaced ? (
                <>
                  {object.isMovable && onRotate && (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={onRotate}
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
                        className="mr-1.5"
                      >
                        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                        <path d="M21 3v5h-5" />
                      </svg>
                      회전
                    </Button>
                  )}
                  {onRemove && (
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={onRemove}
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
                        className="mr-1.5"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                      치우기
                    </Button>
                  )}
                </>
              ) : (
                /* 배치 가능한 경우 */
                onPlace && (
                  <Button className="flex-1" onClick={onPlace}>
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
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                    배치하기
                  </Button>
                )
              )}
            </>
          ) : (
            /* 보기 모드 */
            <Button variant="outline" className="flex-1" onClick={onClose}>
              닫기
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Remove Confirmation Dialog
// =============================================================================

interface RemoveConfirmDialogProps {
  objectName: string
  onConfirm: () => void
  onCancel: () => void
}

export function RemoveConfirmDialog({
  objectName,
  onConfirm,
  onCancel,
}: RemoveConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm animate-in fade-in zoom-in-95 rounded-lg bg-background p-6 shadow-lg duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-2 text-center text-lg font-medium">오브젝트 삭제</h3>
        <p className="mb-4 text-center text-sm text-muted-foreground">
          '{objectName}'을(를) 공간에서 치울까요?
        </p>
        <p className="mb-6 text-center text-xs text-muted-foreground">
          인벤토리에서 다시 배치할 수 있어요
        </p>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            취소
          </Button>
          <Button variant="destructive" className="flex-1" onClick={onConfirm}>
            치우기
          </Button>
        </div>
      </div>
    </div>
  )
}
