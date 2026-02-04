'use client'

import { useRef, useState, useCallback, useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { ObjectPlacement, PixeloObject } from '@/types'

const PLACEHOLDER_IMAGE = '/images/placeholder-object.svg'

// =============================================================================
// Types
// =============================================================================

export interface PlacedObject extends ObjectPlacement {
  object: PixeloObject
}

interface SpaceGridProps {
  gridSize?: number // 그리드 크기 (기본 10x10)
  cellSize?: number // 셀 크기 (px, 기본 40px)
  placedObjects: PlacedObject[]
  isEditMode?: boolean
  selectedObjectId?: string | null
  onObjectClick?: (object: PlacedObject) => void
  onObjectMove?: (objectId: string, x: number, y: number) => void
  onCellClick?: (x: number, y: number) => void
  backgroundUrl?: string
  className?: string
}

// =============================================================================
// Constants
// =============================================================================

const DEFAULT_GRID_SIZE = 10
const DEFAULT_CELL_SIZE = 40
const GRID_GAP = 1

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * 레이어 순서에 따라 오브젝트 정렬
 */
function sortByLayer(objects: PlacedObject[]): PlacedObject[] {
  return [...objects].sort((a, b) => {
    // 먼저 카테고리 레이어 순서로 정렬
    const layerA = a.object.category?.layerOrder ?? 0
    const layerB = b.object.category?.layerOrder ?? 0
    if (layerA !== layerB) return layerA - layerB
    // 같은 레이어면 zIndex로 정렬
    return a.zIndex - b.zIndex
  })
}

// =============================================================================
// Sub Components
// =============================================================================

interface GridCellProps {
  x: number
  y: number
  cellSize: number
  isEditMode: boolean
  onClick?: () => void
}

function GridCell({ x, y, cellSize, isEditMode, onClick }: GridCellProps) {
  return (
    <div
      className={cn(
        'border border-dashed transition-colors',
        isEditMode
          ? 'border-gray-300/50 hover:border-primary/50 hover:bg-primary/5'
          : 'border-transparent'
      )}
      style={{
        width: cellSize,
        height: cellSize,
      }}
      onClick={onClick}
      data-x={x}
      data-y={y}
    />
  )
}

interface SpaceObjectProps {
  placedObject: PlacedObject
  cellSize: number
  isSelected: boolean
  isEditMode: boolean
  onClick: () => void
  onDragStart?: (e: React.DragEvent) => void
  onDragEnd?: (e: React.DragEvent) => void
}

function SpaceObject({
  placedObject,
  cellSize,
  isSelected,
  isEditMode,
  onClick,
  onDragStart,
  onDragEnd,
}: SpaceObjectProps) {
  const { object, x, y, scale, rotation, zIndex } = placedObject
  const width = (object.width ?? 1) * cellSize
  const height = (object.height ?? 1) * cellSize
  const [imgSrc, setImgSrc] = useState(object.imageUrl || PLACEHOLDER_IMAGE)

  const handleImageError = () => {
    setImgSrc(PLACEHOLDER_IMAGE)
  }

  return (
    <div
      className={cn(
        'absolute cursor-pointer transition-all duration-200',
        isSelected && 'ring-2 ring-primary ring-offset-2',
        isEditMode && 'hover:ring-2 hover:ring-primary/50'
      )}
      style={{
        left: x * cellSize + (x * GRID_GAP),
        top: y * cellSize + (y * GRID_GAP),
        width: width * scale,
        height: height * scale,
        transform: `rotate(${rotation}deg)`,
        zIndex: zIndex + 10, // 그리드 셀 위에 표시
      }}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      draggable={isEditMode && object.isMovable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      role="button"
      tabIndex={0}
      aria-label={`${object.name} - 위치 (${x}, ${y})`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {/* 오브젝트 이미지 */}
      <img
        src={imgSrc}
        alt={object.name}
        className="h-full w-full object-contain"
        style={{ imageRendering: 'pixelated' }}
        draggable={false}
        onError={handleImageError}
      />

      {/* 편집 모드에서 선택된 오브젝트 표시 */}
      {isEditMode && isSelected && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-primary px-2 py-0.5 text-xs text-primary-foreground">
          {object.name}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function SpaceGrid({
  gridSize = DEFAULT_GRID_SIZE,
  cellSize = DEFAULT_CELL_SIZE,
  placedObjects,
  isEditMode = false,
  selectedObjectId = null,
  onObjectClick,
  onObjectMove,
  onCellClick,
  backgroundUrl,
  className,
}: SpaceGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [draggedObjectId, setDraggedObjectId] = useState<string | null>(null)

  // 정렬된 오브젝트 목록
  const sortedObjects = useMemo(() => sortByLayer(placedObjects), [placedObjects])

  // 그리드 전체 크기 계산
  const gridWidth = gridSize * cellSize + (gridSize - 1) * GRID_GAP
  const gridHeight = gridSize * cellSize + (gridSize - 1) * GRID_GAP

  // 드래그 시작
  const handleDragStart = useCallback((e: React.DragEvent, objectId: string) => {
    setDraggedObjectId(objectId)
    e.dataTransfer.setData('text/plain', objectId)
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  // 드래그 종료
  const handleDragEnd = useCallback(() => {
    setDraggedObjectId(null)
  }, [])

  // 드래그 오버 (드롭 허용)
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  // 드롭
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const objectId = e.dataTransfer.getData('text/plain')

      if (!objectId || !containerRef.current || !onObjectMove) return

      const rect = containerRef.current.getBoundingClientRect()
      const dropX = e.clientX - rect.left
      const dropY = e.clientY - rect.top

      // 그리드 좌표로 변환
      const gridX = Math.floor(dropX / (cellSize + GRID_GAP))
      const gridY = Math.floor(dropY / (cellSize + GRID_GAP))

      // 범위 체크
      const clampedX = Math.max(0, Math.min(gridSize - 1, gridX))
      const clampedY = Math.max(0, Math.min(gridSize - 1, gridY))

      onObjectMove(objectId, clampedX, clampedY)
      setDraggedObjectId(null)
    },
    [cellSize, gridSize, onObjectMove]
  )

  // 빈 셀 클릭
  const handleCellClick = useCallback(
    (x: number, y: number) => {
      if (isEditMode && onCellClick) {
        onCellClick(x, y)
      }
    },
    [isEditMode, onCellClick]
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden rounded-lg border bg-muted/30',
        isEditMode && 'ring-2 ring-primary/20',
        className
      )}
      style={{
        width: gridWidth + 16, // 패딩 포함
        height: gridHeight + 16,
        padding: 8,
      }}
      onDragOver={isEditMode ? handleDragOver : undefined}
      onDrop={isEditMode ? handleDrop : undefined}
    >
      {/* 배경 이미지 */}
      {backgroundUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
        />
      )}

      {/* 그리드 컨테이너 */}
      <div
        className="relative"
        style={{
          width: gridWidth,
          height: gridHeight,
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
          gap: GRID_GAP,
        }}
      >
        {/* 그리드 셀 */}
        {Array.from({ length: gridSize * gridSize }).map((_, index) => {
          const x = index % gridSize
          const y = Math.floor(index / gridSize)
          return (
            <GridCell
              key={`cell-${x}-${y}`}
              x={x}
              y={y}
              cellSize={cellSize}
              isEditMode={isEditMode}
              onClick={() => handleCellClick(x, y)}
            />
          )
        })}

        {/* 배치된 오브젝트들 */}
        {sortedObjects.map((placedObject) => (
          <SpaceObject
            key={placedObject.objectId}
            placedObject={placedObject}
            cellSize={cellSize}
            isSelected={selectedObjectId === placedObject.objectId}
            isEditMode={isEditMode}
            onClick={() => onObjectClick?.(placedObject)}
            onDragStart={
              isEditMode && placedObject.object.isMovable
                ? (e) => handleDragStart(e, placedObject.objectId)
                : undefined
            }
            onDragEnd={isEditMode ? handleDragEnd : undefined}
          />
        ))}
      </div>

      {/* 드래그 중 오버레이 */}
      {draggedObjectId && (
        <div className="pointer-events-none absolute inset-0 bg-primary/5" />
      )}

      {/* 빈 공간 안내 */}
      {placedObjects.length === 0 && !isEditMode && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p className="text-sm">아직 배치된 오브젝트가 없어요</p>
            <p className="mt-1 text-xs">편집 버튼을 눌러 공간을 꾸며보세요</p>
          </div>
        </div>
      )}
    </div>
  )
}
