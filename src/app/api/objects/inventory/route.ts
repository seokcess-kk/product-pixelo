import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { successResponse, handleError, errorResponse } from '@/lib/api/response'
import { UnauthorizedError, ErrorCodes } from '@/lib/api/errors'
import type {
  PixeloObject,
  ObjectCategory,
  UserObject,
  InventoryItem,
  ObjectPlacement,
} from '@/types'

// =============================================================================
// Types for DB responses
// =============================================================================

interface UserObjectRow {
  id: string
  user_id: string
  object_id: string
  acquired_at: string
  acquired_reason: string | null
  objects: {
    id: string
    season_id: string
    category_id: string
    name: string
    description: string | null
    image_url: string
    thumbnail_url: string | null
    axis_id: string | null
    min_score: number | null
    max_score: number | null
    default_x: number
    default_y: number
    width: number | null
    height: number | null
    is_movable: boolean
    is_resizable: boolean
    acquisition_type: string
    acquisition_day: number | null
    created_at: string
    updated_at: string
    object_categories: {
      id: string
      code: string
      name: string
      layer_order: number
    }
  }
}

interface SpaceLayoutRow {
  season_id: string
  layout: ObjectPlacement[]
}

// =============================================================================
// Helper Functions
// =============================================================================

function mapUserObjectRowToInventoryItem(
  row: UserObjectRow,
  placedObjectIds: Set<string>
): InventoryItem {
  const obj = row.objects

  const pixeloObject: PixeloObject = {
    id: obj.id,
    seasonId: obj.season_id,
    categoryId: obj.category_id,
    name: obj.name,
    description: obj.description ?? undefined,
    imageUrl: obj.image_url,
    thumbnailUrl: obj.thumbnail_url ?? undefined,
    axisId: obj.axis_id ?? undefined,
    minScore: obj.min_score ?? undefined,
    maxScore: obj.max_score ?? undefined,
    defaultX: obj.default_x,
    defaultY: obj.default_y,
    width: obj.width ?? undefined,
    height: obj.height ?? undefined,
    isMovable: obj.is_movable,
    isResizable: obj.is_resizable,
    acquisitionType: obj.acquisition_type as 'axis_score' | 'day' | 'default',
    acquisitionDay: obj.acquisition_day ?? undefined,
    createdAt: obj.created_at,
    updatedAt: obj.updated_at,
    category: obj.object_categories
      ? {
          id: obj.object_categories.id,
          code: obj.object_categories.code,
          name: obj.object_categories.name,
          layerOrder: obj.object_categories.layer_order,
        }
      : undefined,
  }

  const userObject: UserObject = {
    id: row.id,
    userId: row.user_id,
    objectId: row.object_id,
    acquiredAt: row.acquired_at,
    acquiredReason: row.acquired_reason ?? undefined,
    object: pixeloObject,
  }

  return {
    userObject,
    object: pixeloObject,
    isPlaced: placedObjectIds.has(obj.id),
  }
}

// =============================================================================
// GET /api/objects/inventory - 오브젝트 인벤토리 조회
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 인증 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new UnauthorizedError()
    }

    // URL 쿼리 파라미터에서 시즌 필터 추출
    const { searchParams } = new URL(request.url)
    const seasonParam = searchParams.get('season')
    const categoryParam = searchParams.get('category')

    // 사용자 획득 오브젝트 조회
    let query = supabase
      .from('user_objects')
      .select(
        `
        id,
        user_id,
        object_id,
        acquired_at,
        acquired_reason,
        objects (
          id,
          season_id,
          category_id,
          name,
          description,
          image_url,
          thumbnail_url,
          axis_id,
          min_score,
          max_score,
          default_x,
          default_y,
          width,
          height,
          is_movable,
          is_resizable,
          acquisition_type,
          acquisition_day,
          created_at,
          updated_at,
          object_categories (
            id,
            code,
            name,
            layer_order
          )
        )
      `
      )
      .eq('user_id', user.id)
      .order('acquired_at', { ascending: false })

    const { data: userObjectsData, error: userObjectsError } = await query

    if (userObjectsError) {
      console.error('User objects fetch error:', userObjectsError)
      return errorResponse(
        ErrorCodes.DATABASE_ERROR,
        '인벤토리 조회에 실패했습니다.',
        500
      )
    }

    // 시즌별 필터링을 위해 시즌 번호로 시즌 ID 조회
    let seasonId: string | null = null
    if (seasonParam) {
      const seasonNumber = parseInt(seasonParam, 10)
      if (!isNaN(seasonNumber) && seasonNumber > 0) {
        const { data: seasonData } = await supabase
          .from('seasons')
          .select('id')
          .eq('season_number', seasonNumber)
          .single()

        if (seasonData) {
          seasonId = seasonData.id
        }
      }
    }

    // 사용자의 모든 공간에서 배치된 오브젝트 ID 수집
    const { data: spacesData, error: spacesError } = await supabase
      .from('spaces')
      .select('season_id, layout')
      .eq('user_id', user.id)

    const placedObjectIds = new Set<string>()
    if (!spacesError && spacesData) {
      for (const space of spacesData as SpaceLayoutRow[]) {
        const layout = space.layout || []
        for (const item of layout) {
          placedObjectIds.add(item.objectId)
        }
      }
    }

    // 결과 매핑 및 필터링
    let inventoryItems: InventoryItem[] = []

    if (userObjectsData) {
      inventoryItems = (userObjectsData as UserObjectRow[])
        .filter((row) => row.objects !== null) // 오브젝트가 삭제된 경우 제외
        .filter((row) => {
          // 시즌 필터링
          if (seasonId && row.objects.season_id !== seasonId) {
            return false
          }
          // 카테고리 필터링
          if (
            categoryParam &&
            row.objects.object_categories?.code !== categoryParam
          ) {
            return false
          }
          return true
        })
        .map((row) => mapUserObjectRowToInventoryItem(row, placedObjectIds))
    }

    // 카테고리별로 그룹화
    const groupedByCategory = inventoryItems.reduce(
      (acc, item) => {
        const categoryCode = item.object.category?.code || 'uncategorized'
        if (!acc[categoryCode]) {
          acc[categoryCode] = {
            category: item.object.category || {
              id: 'uncategorized',
              code: 'uncategorized',
              name: '미분류',
              layerOrder: 999,
            },
            items: [],
          }
        }
        acc[categoryCode].items.push(item)
        return acc
      },
      {} as Record<
        string,
        {
          category: ObjectCategory
          items: InventoryItem[]
        }
      >
    )

    // 레이어 순서로 정렬
    const sortedCategories = Object.values(groupedByCategory).sort(
      (a, b) => a.category.layerOrder - b.category.layerOrder
    )

    return successResponse({
      items: inventoryItems,
      groupedByCategory: sortedCategories,
      totalCount: inventoryItems.length,
      placedCount: inventoryItems.filter((item) => item.isPlaced).length,
      filters: {
        season: seasonParam,
        category: categoryParam,
      },
    })
  } catch (error) {
    return handleError(error)
  }
}
