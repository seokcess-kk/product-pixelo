'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { SpaceGrid } from '@/components/features/space/SpaceGrid'
import { ObjectInventory } from '@/components/features/space/ObjectInventory'
import { ObjectDetail, RemoveConfirmDialog } from '@/components/features/space/ObjectDetail'
import { EditToolbar } from '@/components/features/space/EditToolbar'
import { SeasonSelector } from '@/components/features/space/SeasonSelector'
import { useObjectSpace, type PlacedObjectWithData } from '@/hooks/useObjectSpace'
import type { InventoryItem, PixeloObject, UserObject } from '@/types'

// =============================================================================
// Types
// =============================================================================

interface SpacePageProps {
  params: {
    season: string
  }
}

// =============================================================================
// Main Page Component
// =============================================================================

export default function SpacePage({ params }: SpacePageProps) {
  const { season } = params
  const seasonNumber = parseInt(season, 10) || 1
  const router = useRouter()

  // 공간 상태 관리
  const {
    space,
    placedObjects,
    season: seasonData,
    inventory,
    isLoading,
    isInventoryLoading,
    isSaving,
    error,
    isEditMode,
    selectedObjectId,
    hasChanges,
    canUndo,
    setEditMode,
    selectObject,
    placeObject,
    moveObject,
    removeObject,
    rotateObject,
    undo,
    save,
  } = useObjectSpace({ seasonNumber })

  // 로컬 UI 상태
  const [showObjectDetail, setShowObjectDetail] = useState(false)
  const [detailObject, setDetailObject] = useState<{
    object: PixeloObject
    userObject?: UserObject
    isPlaced: boolean
  } | null>(null)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const [objectToRemove, setObjectToRemove] = useState<string | null>(null)
  const [showInventorySidebar, setShowInventorySidebar] = useState(false)

  // 선택된 인벤토리 아이템
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItem | null>(null)

  // ==========================================================================
  // Handlers
  // ==========================================================================

  // 오브젝트 클릭 (그리드에서)
  const handleObjectClick = useCallback(
    (placedObject: PlacedObjectWithData) => {
      selectObject(placedObject.objectId)

      if (!isEditMode) {
        // 보기 모드에서는 상세 정보 표시
        const inventoryItem = inventory.find(
          (item) => item.object.id === placedObject.objectId
        )
        setDetailObject({
          object: placedObject.object,
          userObject: inventoryItem?.userObject,
          isPlaced: true,
        })
        setShowObjectDetail(true)
      }
    },
    [selectObject, isEditMode, inventory]
  )

  // 오브젝트 이동 (드래그 앤 드롭)
  const handleObjectMove = useCallback(
    (objectId: string, x: number, y: number) => {
      if (isEditMode) {
        moveObject(objectId, x, y)
      }
    },
    [isEditMode, moveObject]
  )

  // 빈 셀 클릭 (배치 위치 선택)
  const handleCellClick = useCallback(
    (x: number, y: number) => {
      if (!isEditMode) return

      // 선택된 인벤토리 아이템이 있으면 배치
      if (selectedInventoryItem && !selectedInventoryItem.isPlaced) {
        placeObject(selectedInventoryItem.object.id, x, y)
        setSelectedInventoryItem(null)
      }
    },
    [isEditMode, selectedInventoryItem, placeObject]
  )

  // 인벤토리 아이템 선택
  const handleInventorySelect = useCallback((item: InventoryItem) => {
    setSelectedInventoryItem(item)
    selectObject(item.object.id)

    // 상세 정보 표시
    setDetailObject({
      object: item.object,
      userObject: item.userObject,
      isPlaced: item.isPlaced,
    })
    setShowObjectDetail(true)
  }, [selectObject])

  // 인벤토리에서 배치하기
  const handleInventoryPlace = useCallback(
    (item: InventoryItem) => {
      setSelectedInventoryItem(item)
      selectObject(item.object.id)
      setShowObjectDetail(false)
      // 사용자가 위치를 클릭하면 배치됨
    },
    [selectObject]
  )

  // 오브젝트 삭제 확인
  const handleRemoveClick = useCallback(() => {
    if (selectedObjectId) {
      setObjectToRemove(selectedObjectId)
      setShowRemoveConfirm(true)
      setShowObjectDetail(false)
    }
  }, [selectedObjectId])

  // 오브젝트 삭제 확정
  const handleRemoveConfirm = useCallback(() => {
    if (objectToRemove) {
      removeObject(objectToRemove)
      setObjectToRemove(null)
      setShowRemoveConfirm(false)
    }
  }, [objectToRemove, removeObject])

  // 오브젝트 회전
  const handleRotate = useCallback(() => {
    if (selectedObjectId) {
      rotateObject(selectedObjectId)
    }
  }, [selectedObjectId, rotateObject])

  // 편집 모드 전환
  const handleEditToggle = useCallback(() => {
    if (isEditMode && hasChanges) {
      // 변경사항이 있으면 저장 여부 확인
      const shouldSave = window.confirm('변경사항을 저장하시겠어요?')
      if (shouldSave) {
        save().then(() => setEditMode(false))
      } else {
        setEditMode(false)
      }
    } else {
      setEditMode(!isEditMode)
      if (!isEditMode) {
        setShowInventorySidebar(true)
      }
    }
  }, [isEditMode, hasChanges, save, setEditMode])

  // 시즌 변경
  const handleSeasonChange = useCallback(
    (newSeason: number) => {
      router.push(`/space/${newSeason}`)
    },
    [router]
  )

  // ==========================================================================
  // Loading State
  // ==========================================================================

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">공간을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // ==========================================================================
  // Error State
  // ==========================================================================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <p className="mb-4 text-destructive">{error}</p>
          <Button onClick={() => window.location.reload()}>다시 시도</Button>
        </div>
      </div>
    )
  }

  // ==========================================================================
  // Computed Values
  // ==========================================================================

  const completionPercent =
    inventory.length > 0
      ? Math.round((inventory.filter((i) => i.isPlaced).length / inventory.length) * 100)
      : 0

  // ==========================================================================
  // Render
  // ==========================================================================

  return (
    <div className="flex min-h-screen flex-col">
      {/* 헤더 */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="rounded-full p-2 hover:bg-muted"
              aria-label="뒤로가기"
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
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <h1 className="text-lg font-medium">
              {seasonData?.name || '나의 공간'}
            </h1>
          </div>

          <EditToolbar
            isEditMode={isEditMode}
            hasChanges={hasChanges}
            canUndo={canUndo}
            isSaving={isSaving}
            onEditToggle={handleEditToggle}
            onUndo={undo}
            onSave={save}
          />
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex flex-1">
        {/* 공간 영역 */}
        <div
          className={cn(
            'flex-1 overflow-auto p-4 transition-all',
            isEditMode && showInventorySidebar && 'lg:pr-80'
          )}
        >
          <div className="mx-auto max-w-2xl">
            {/* 시즌 선택 */}
            <div className="mb-4 flex items-center justify-between">
              <SeasonSelector
                currentSeason={seasonNumber}
                onSeasonChange={handleSeasonChange}
              />

              {/* 완성도 표시 */}
              <div className="text-sm text-muted-foreground">
                완성도: {completionPercent}%
              </div>
            </div>

            {/* 공간 그리드 */}
            <div className="flex justify-center">
              <SpaceGrid
                gridSize={10}
                cellSize={36}
                placedObjects={placedObjects}
                isEditMode={isEditMode}
                selectedObjectId={selectedObjectId}
                onObjectClick={handleObjectClick}
                onObjectMove={handleObjectMove}
                onCellClick={handleCellClick}
                backgroundUrl={seasonData?.spaceBackgroundUrl}
                className="mx-auto"
              />
            </div>

            {/* 배치 안내 (선택된 아이템이 있을 때) */}
            {isEditMode && selectedInventoryItem && !selectedInventoryItem.isPlaced && (
              <div className="mt-4 rounded-lg bg-primary/10 p-3 text-center text-sm">
                <p className="font-medium text-primary">
                  '{selectedInventoryItem.object.name}' 배치할 위치를 선택하세요
                </p>
                <button
                  onClick={() => {
                    setSelectedInventoryItem(null)
                    selectObject(null)
                  }}
                  className="mt-1 text-xs text-muted-foreground underline"
                >
                  취소
                </button>
              </div>
            )}

            {/* 공간 정보 */}
            <div className="mt-4 rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-medium">{space?.name || seasonData?.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    오브젝트: {placedObjects.length}/{inventory.length}
                  </p>
                </div>
                <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 인벤토리 사이드바 (편집 모드) */}
        {isEditMode && (
          <aside
            className={cn(
              'fixed inset-y-0 right-0 z-30 w-80 border-l bg-background transition-transform lg:translate-x-0',
              showInventorySidebar ? 'translate-x-0' : 'translate-x-full'
            )}
            style={{ top: '3.5rem' }}
          >
            <div className="flex h-full flex-col">
              {/* 사이드바 헤더 (모바일) */}
              <div className="flex items-center justify-between border-b p-3 lg:hidden">
                <span className="font-medium">인벤토리</span>
                <button
                  onClick={() => setShowInventorySidebar(false)}
                  className="rounded-full p-1.5 hover:bg-muted"
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

              {/* 인벤토리 목록 */}
              <ObjectInventory
                items={inventory}
                isLoading={isInventoryLoading}
                selectedObjectId={selectedObjectId}
                onObjectSelect={handleInventorySelect}
                onObjectPlace={handleInventoryPlace}
                className="flex-1 border-none"
              />
            </div>
          </aside>
        )}

        {/* 인벤토리 토글 버튼 (모바일, 편집 모드) */}
        {isEditMode && !showInventorySidebar && (
          <button
            onClick={() => setShowInventorySidebar(true)}
            className="fixed bottom-20 right-4 z-30 flex h-12 items-center gap-2 rounded-full bg-primary px-4 text-primary-foreground shadow-lg lg:hidden"
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
              <rect width="7" height="9" x="3" y="3" rx="1" />
              <rect width="7" height="5" x="14" y="3" rx="1" />
              <rect width="7" height="9" x="14" y="12" rx="1" />
              <rect width="7" height="5" x="3" y="16" rx="1" />
            </svg>
            인벤토리
          </button>
        )}
      </main>

      {/* 오브젝트 상세 모달 */}
      {showObjectDetail && detailObject && (
        <ObjectDetail
          object={detailObject.object}
          userObject={detailObject.userObject}
          isPlaced={detailObject.isPlaced}
          isEditMode={isEditMode}
          onClose={() => {
            setShowObjectDetail(false)
            setDetailObject(null)
          }}
          onPlace={
            !detailObject.isPlaced
              ? () => {
                  const item = inventory.find(
                    (i) => i.object.id === detailObject.object.id
                  )
                  if (item) {
                    handleInventoryPlace(item)
                  }
                }
              : undefined
          }
          onRemove={detailObject.isPlaced ? handleRemoveClick : undefined}
          onRotate={
            detailObject.isPlaced && detailObject.object.isMovable
              ? handleRotate
              : undefined
          }
        />
      )}

      {/* 삭제 확인 모달 */}
      {showRemoveConfirm && objectToRemove && (
        <RemoveConfirmDialog
          objectName={
            placedObjects.find((p) => p.objectId === objectToRemove)?.object
              .name || '오브젝트'
          }
          onConfirm={handleRemoveConfirm}
          onCancel={() => {
            setShowRemoveConfirm(false)
            setObjectToRemove(null)
          }}
        />
      )}
    </div>
  )
}
