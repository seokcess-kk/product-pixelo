'use client'

import { useState, useCallback, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import type { InventoryItem, ObjectCategory } from '@/types'

const PLACEHOLDER_IMAGE = '/images/placeholder-object.svg'

// =============================================================================
// Types
// =============================================================================

interface ObjectInventoryProps {
  items: InventoryItem[]
  groupedByCategory?: {
    category: ObjectCategory
    items: InventoryItem[]
  }[]
  isLoading?: boolean
  selectedObjectId?: string | null
  onObjectSelect?: (item: InventoryItem) => void
  onObjectPlace?: (item: InventoryItem) => void
  className?: string
}

// =============================================================================
// Constants
// =============================================================================

const CATEGORY_FILTERS = [
  { code: 'all', name: '전체' },
  { code: 'furniture', name: '가구' },
  { code: 'lighting', name: '조명' },
  { code: 'decoration', name: '소품' },
  { code: 'floor', name: '바닥' },
  { code: 'wall', name: '벽' },
] as const

// =============================================================================
// Sub Components
// =============================================================================

interface InventoryItemCardProps {
  item: InventoryItem
  isSelected: boolean
  onClick: () => void
  onPlace?: () => void
}

function InventoryItemCard({
  item,
  isSelected,
  onClick,
  onPlace,
}: InventoryItemCardProps) {
  const { object, isPlaced } = item
  const [imgSrc, setImgSrc] = useState(
    object.thumbnailUrl || object.imageUrl || PLACEHOLDER_IMAGE
  )

  const handleImageError = () => {
    setImgSrc(PLACEHOLDER_IMAGE)
  }

  return (
    <div
      className={cn(
        'relative flex flex-col items-center rounded-lg border p-2 transition-all',
        'cursor-pointer hover:border-primary/50 hover:bg-accent/50',
        isSelected && 'border-primary bg-accent ring-2 ring-primary/20',
        isPlaced && 'opacity-60'
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      draggable={!isPlaced}
      onDragStart={(e) => {
        e.dataTransfer.setData('application/json', JSON.stringify({
          type: 'inventory-item',
          objectId: object.id,
        }))
        e.dataTransfer.effectAllowed = 'copy'
      }}
    >
      {/* 썸네일 */}
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted">
        <img
          src={imgSrc}
          alt={object.name}
          className="h-full w-full object-contain"
          style={{ imageRendering: 'pixelated' }}
          draggable={false}
          onError={handleImageError}
        />

        {/* 배치됨 표시 */}
        {isPlaced && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-gray-700">
              배치됨
            </span>
          </div>
        )}
      </div>

      {/* 이름 */}
      <p className="mt-1.5 w-full truncate text-center text-xs font-medium">
        {object.name}
      </p>

      {/* 선택 시 배치 버튼 */}
      {isSelected && !isPlaced && onPlace && (
        <Button
          size="sm"
          className="mt-2 h-7 w-full text-xs"
          onClick={(e) => {
            e.stopPropagation()
            onPlace()
          }}
        >
          배치하기
        </Button>
      )}
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function ObjectInventory({
  items,
  groupedByCategory,
  isLoading = false,
  selectedObjectId = null,
  onObjectSelect,
  onObjectPlace,
  className,
}: ObjectInventoryProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all')

  // 필터링된 아이템
  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return items
    return items.filter((item) => item.object.category?.code === activeFilter)
  }, [items, activeFilter])

  // 통계
  const stats = useMemo(() => {
    const total = items.length
    const placed = items.filter((item) => item.isPlaced).length
    return { total, placed, unplaced: total - placed }
  }, [items])

  // 아이템 선택 핸들러
  const handleItemClick = useCallback(
    (item: InventoryItem) => {
      onObjectSelect?.(item)
    },
    [onObjectSelect]
  )

  // 아이템 배치 핸들러
  const handleItemPlace = useCallback(
    (item: InventoryItem) => {
      onObjectPlace?.(item)
    },
    [onObjectPlace]
  )

  // 로딩 상태
  if (isLoading) {
    return (
      <div
        className={cn(
          'flex h-40 items-center justify-center rounded-lg border bg-card',
          className
        )}
      >
        <Spinner />
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col rounded-lg border bg-card', className)}>
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <h3 className="text-sm font-medium">인벤토리</h3>
          <p className="text-xs text-muted-foreground">
            {stats.total}개 보유 / {stats.placed}개 배치됨
          </p>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-1.5 overflow-x-auto border-b px-4 py-2">
        {CATEGORY_FILTERS.map((filter) => (
          <button
            key={filter.code}
            className={cn(
              'shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors',
              activeFilter === filter.code
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
            onClick={() => setActiveFilter(filter.code)}
          >
            {filter.name}
          </button>
        ))}
      </div>

      {/* 아이템 그리드 */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredItems.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            {activeFilter === 'all'
              ? '아직 획득한 오브젝트가 없어요'
              : '해당 카테고리에 오브젝트가 없어요'}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {filteredItems.map((item) => (
              <InventoryItemCard
                key={item.object.id}
                item={item}
                isSelected={selectedObjectId === item.object.id}
                onClick={() => handleItemClick(item)}
                onPlace={
                  !item.isPlaced ? () => handleItemPlace(item) : undefined
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
