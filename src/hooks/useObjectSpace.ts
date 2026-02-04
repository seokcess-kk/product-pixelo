'use client'

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import type {
  UserSpace,
  ObjectPlacement,
  PixeloObject,
  InventoryItem,
  SeasonDetail,
} from '@/types'

// =============================================================================
// Types
// =============================================================================

export interface PlacedObjectWithData extends ObjectPlacement {
  object: PixeloObject
}

export interface SpaceData {
  space: UserSpace
  placedObjects: PlacedObjectWithData[]
  season: SeasonDetail
}

export interface InventoryData {
  items: InventoryItem[]
  groupedByCategory: {
    category: { id: string; code: string; name: string; layerOrder: number }
    items: InventoryItem[]
  }[]
  totalCount: number
  placedCount: number
}

interface UseObjectSpaceOptions {
  seasonNumber: number
  autoSave?: boolean
  maxHistorySize?: number
}

interface UseObjectSpaceReturn {
  // 데이터
  space: UserSpace | null
  placedObjects: PlacedObjectWithData[]
  season: SeasonDetail | null
  inventory: InventoryItem[]

  // 상태
  isLoading: boolean
  isInventoryLoading: boolean
  isSaving: boolean
  error: string | null

  // 편집 상태
  isEditMode: boolean
  selectedObjectId: string | null
  hasChanges: boolean
  canUndo: boolean

  // 액션
  setEditMode: (enabled: boolean) => void
  selectObject: (objectId: string | null) => void
  placeObject: (objectId: string, x: number, y: number) => void
  moveObject: (objectId: string, x: number, y: number) => void
  removeObject: (objectId: string) => void
  rotateObject: (objectId: string) => void
  undo: () => void
  save: () => Promise<boolean>
  refresh: () => Promise<void>
}

// =============================================================================
// Hook Implementation
// =============================================================================

export function useObjectSpace({
  seasonNumber,
  autoSave = false,
  maxHistorySize = 10,
}: UseObjectSpaceOptions): UseObjectSpaceReturn {
  // 데이터 상태
  const [space, setSpace] = useState<UserSpace | null>(null)
  const [placedObjects, setPlacedObjects] = useState<PlacedObjectWithData[]>([])
  const [season, setSeason] = useState<SeasonDetail | null>(null)
  const [inventory, setInventory] = useState<InventoryItem[]>([])

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true)
  const [isInventoryLoading, setIsInventoryLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 편집 상태
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null)

  // 히스토리 (Undo용)
  const historyRef = useRef<ObjectPlacement[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // 원본 레이아웃 (변경 감지용)
  const originalLayoutRef = useRef<ObjectPlacement[]>([])

  // 변경 여부 확인
  const hasChanges = useMemo(() => {
    if (!space) return false
    const current = JSON.stringify(space.layout)
    const original = JSON.stringify(originalLayoutRef.current)
    return current !== original
  }, [space])

  const canUndo = historyIndex > 0

  // ==========================================================================
  // Data Fetching
  // ==========================================================================

  const fetchSpace = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/space/${seasonNumber}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.message || '공간을 불러오는데 실패했습니다.')
      }

      const { space: spaceData, placedObjects: placedObjectsData, season: seasonData } = result.data

      setSpace(spaceData)
      setPlacedObjects(placedObjectsData || [])
      setSeason(seasonData)

      // 원본 레이아웃 저장
      originalLayoutRef.current = spaceData?.layout || []

      // 히스토리 초기화
      historyRef.current = [spaceData?.layout || []]
      setHistoryIndex(0)
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [seasonNumber])

  const fetchInventory = useCallback(async () => {
    try {
      setIsInventoryLoading(true)

      const response = await fetch(`/api/objects/inventory?season=${seasonNumber}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.message || '인벤토리를 불러오는데 실패했습니다.')
      }

      setInventory(result.data.items || [])
    } catch (err) {
      console.error('Failed to fetch inventory:', err)
    } finally {
      setIsInventoryLoading(false)
    }
  }, [seasonNumber])

  // 초기 데이터 로드
  useEffect(() => {
    fetchSpace()
    fetchInventory()
  }, [fetchSpace, fetchInventory])

  // ==========================================================================
  // History Management
  // ==========================================================================

  const pushHistory = useCallback((layout: ObjectPlacement[]) => {
    const newHistory = historyRef.current.slice(0, historyIndex + 1)
    newHistory.push([...layout])

    // 최대 히스토리 크기 제한
    if (newHistory.length > maxHistorySize) {
      newHistory.shift()
    }

    historyRef.current = newHistory
    setHistoryIndex(newHistory.length - 1)
  }, [historyIndex, maxHistorySize])

  const undo = useCallback(() => {
    if (!canUndo || !space) return

    const prevIndex = historyIndex - 1
    const prevLayout = historyRef.current[prevIndex]

    setHistoryIndex(prevIndex)
    setSpace((prev) => prev ? { ...prev, layout: [...prevLayout] } : null)

    // placedObjects도 업데이트
    setPlacedObjects((current) => {
      // 현재 오브젝트 맵 생성
      const objectMap = new Map<string, PixeloObject>()
      current.forEach((po) => objectMap.set(po.objectId, po.object))
      inventory.forEach((item) => objectMap.set(item.object.id, item.object))

      // 새 레이아웃으로 placedObjects 재구성
      return prevLayout
        .map((placement) => {
          const object = objectMap.get(placement.objectId)
          if (!object) return null
          return { ...placement, object }
        })
        .filter((item): item is PlacedObjectWithData => item !== null)
    })

    // 인벤토리 상태 업데이트
    const placedIds = new Set(prevLayout.map((p) => p.objectId))
    setInventory((prev) =>
      prev.map((item) => ({
        ...item,
        isPlaced: placedIds.has(item.object.id),
      }))
    )
  }, [canUndo, historyIndex, space, inventory])

  // ==========================================================================
  // Edit Actions
  // ==========================================================================

  const setEditModeHandler = useCallback((enabled: boolean) => {
    setIsEditMode(enabled)
    if (!enabled) {
      setSelectedObjectId(null)
    }
  }, [])

  const selectObject = useCallback((objectId: string | null) => {
    setSelectedObjectId(objectId)
  }, [])

  const placeObject = useCallback((objectId: string, x: number, y: number) => {
    if (!space) return

    // 이미 배치된 경우 무시
    const existing = space.layout.find((p) => p.objectId === objectId)
    if (existing) return

    // 인벤토리에서 오브젝트 찾기
    const inventoryItem = inventory.find((item) => item.object.id === objectId)
    if (!inventoryItem) return

    const newPlacement: ObjectPlacement = {
      objectId,
      x,
      y,
      scale: 1,
      rotation: 0,
      zIndex: space.layout.length,
    }

    const newLayout = [...space.layout, newPlacement]

    pushHistory(newLayout)
    setSpace((prev) => prev ? { ...prev, layout: newLayout } : null)
    setPlacedObjects((prev) => [...prev, { ...newPlacement, object: inventoryItem.object }])

    // 인벤토리 상태 업데이트
    setInventory((prev) =>
      prev.map((item) =>
        item.object.id === objectId ? { ...item, isPlaced: true } : item
      )
    )
  }, [space, inventory, pushHistory])

  const moveObject = useCallback((objectId: string, x: number, y: number) => {
    if (!space) return

    const newLayout = space.layout.map((p) =>
      p.objectId === objectId ? { ...p, x, y } : p
    )

    pushHistory(newLayout)
    setSpace((prev) => prev ? { ...prev, layout: newLayout } : null)
    setPlacedObjects((prev) =>
      prev.map((po) =>
        po.objectId === objectId ? { ...po, x, y } : po
      )
    )
  }, [space, pushHistory])

  const removeObject = useCallback((objectId: string) => {
    if (!space) return

    const newLayout = space.layout.filter((p) => p.objectId !== objectId)

    pushHistory(newLayout)
    setSpace((prev) => prev ? { ...prev, layout: newLayout } : null)
    setPlacedObjects((prev) => prev.filter((po) => po.objectId !== objectId))

    // 인벤토리 상태 업데이트
    setInventory((prev) =>
      prev.map((item) =>
        item.object.id === objectId ? { ...item, isPlaced: false } : item
      )
    )

    // 선택 해제
    if (selectedObjectId === objectId) {
      setSelectedObjectId(null)
    }
  }, [space, pushHistory, selectedObjectId])

  const rotateObject = useCallback((objectId: string) => {
    if (!space) return

    const newLayout = space.layout.map((p) =>
      p.objectId === objectId
        ? { ...p, rotation: (p.rotation + 90) % 360 }
        : p
    )

    pushHistory(newLayout)
    setSpace((prev) => prev ? { ...prev, layout: newLayout } : null)
    setPlacedObjects((prev) =>
      prev.map((po) =>
        po.objectId === objectId
          ? { ...po, rotation: (po.rotation + 90) % 360 }
          : po
      )
    )
  }, [space, pushHistory])

  // ==========================================================================
  // Save
  // ==========================================================================

  const save = useCallback(async (): Promise<boolean> => {
    if (!space || !hasChanges) return true

    try {
      setIsSaving(true)

      const response = await fetch(`/api/space/${seasonNumber}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layout: space.layout }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.message || '저장에 실패했습니다.')
      }

      // 원본 레이아웃 업데이트
      originalLayoutRef.current = [...space.layout]

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.')
      return false
    } finally {
      setIsSaving(false)
    }
  }, [space, hasChanges, seasonNumber])

  // 자동 저장
  useEffect(() => {
    if (!autoSave || !hasChanges) return

    const timer = setTimeout(() => {
      save()
    }, 3000)

    return () => clearTimeout(timer)
  }, [autoSave, hasChanges, save])

  // ==========================================================================
  // Refresh
  // ==========================================================================

  const refresh = useCallback(async () => {
    await Promise.all([fetchSpace(), fetchInventory()])
  }, [fetchSpace, fetchInventory])

  // ==========================================================================
  // Return
  // ==========================================================================

  return {
    // 데이터
    space,
    placedObjects,
    season,
    inventory,

    // 상태
    isLoading,
    isInventoryLoading,
    isSaving,
    error,

    // 편집 상태
    isEditMode,
    selectedObjectId,
    hasChanges,
    canUndo,

    // 액션
    setEditMode: setEditModeHandler,
    selectObject,
    placeObject,
    moveObject,
    removeObject,
    rotateObject,
    undo,
    save,
    refresh,
  }
}
