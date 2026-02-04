import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import {
  successResponse,
  handleError,
  errorResponse,
} from '@/lib/api/response'
import {
  UnauthorizedError,
  NotFoundError,
  ValidationError,
  ErrorCodes,
} from '@/lib/api/errors'
import type {
  ObjectPlacement,
  PixeloObject,
  ObjectCategory,
  UserSpace,
} from '@/types'

// =============================================================================
// Validation Schemas
// =============================================================================

const objectPlacementSchema = z.object({
  objectId: z.string().uuid(),
  x: z.number(),
  y: z.number(),
  scale: z.number().min(0.1).max(3).default(1),
  rotation: z.number().min(0).max(360).default(0),
  zIndex: z.number().int().min(0).default(0),
})

const updateSpaceSchema = z.object({
  layout: z.array(objectPlacementSchema).optional(),
  backgroundVariant: z.string().max(50).optional(),
  name: z.string().max(100).optional(),
  isPublic: z.boolean().optional(),
})

// =============================================================================
// Types for DB responses
// =============================================================================

interface SeasonRow {
  id: string
  season_number: number
  name: string
  description: string | null
  space_type: string
  space_background_url: string | null
  total_questions: number
  total_days: number
  is_active: boolean
  start_date: string | null
  end_date: string | null
}

interface SpaceRow {
  id: string
  user_id: string
  season_id: string
  name: string | null
  is_public: boolean
  layout: ObjectPlacement[]
  background_variant: string | null
  last_edited_at: string | null
  created_at: string
  updated_at: string
}

interface ObjectRow {
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

// =============================================================================
// Helper Functions
// =============================================================================

function mapObjectRowToPixeloObject(row: ObjectRow): PixeloObject {
  return {
    id: row.id,
    seasonId: row.season_id,
    categoryId: row.category_id,
    name: row.name,
    description: row.description ?? undefined,
    imageUrl: row.image_url,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    axisId: row.axis_id ?? undefined,
    minScore: row.min_score ?? undefined,
    maxScore: row.max_score ?? undefined,
    defaultX: row.default_x,
    defaultY: row.default_y,
    width: row.width ?? undefined,
    height: row.height ?? undefined,
    isMovable: row.is_movable,
    isResizable: row.is_resizable,
    acquisitionType: row.acquisition_type as 'axis_score' | 'day' | 'default',
    acquisitionDay: row.acquisition_day ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    category: row.object_categories
      ? {
          id: row.object_categories.id,
          code: row.object_categories.code,
          name: row.object_categories.name,
          layerOrder: row.object_categories.layer_order,
        }
      : undefined,
  }
}

function mapSpaceRowToUserSpace(row: SpaceRow): UserSpace {
  return {
    id: row.id,
    userId: row.user_id,
    seasonId: row.season_id,
    name: row.name ?? undefined,
    isPublic: row.is_public,
    layout: row.layout || [],
    backgroundVariant: row.background_variant ?? undefined,
    lastEditedAt: row.last_edited_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// =============================================================================
// GET /api/space/[season] - 사용자 공간 조회
// =============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ season: string }> }
) {
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

    const { season } = await params
    const seasonNumber = parseInt(season, 10)

    // 시즌 번호 유효성 검증
    if (isNaN(seasonNumber) || seasonNumber < 1) {
      throw new ValidationError('유효하지 않은 시즌 번호입니다.')
    }

    // 시즌 정보 조회
    const { data: seasonData, error: seasonError } = await supabase
      .from('seasons')
      .select('*')
      .eq('season_number', seasonNumber)
      .single()

    if (seasonError || !seasonData) {
      throw new NotFoundError('시즌')
    }

    const typedSeason = seasonData as SeasonRow

    // 사용자 공간 조회 (없으면 생성)
    let { data: spaceData, error: spaceError } = await supabase
      .from('spaces')
      .select('*')
      .eq('user_id', user.id)
      .eq('season_id', typedSeason.id)
      .single()

    // 공간이 없으면 새로 생성
    if (spaceError && spaceError.code === 'PGRST116') {
      const { data: newSpace, error: createError } = await supabase
        .from('spaces')
        .insert({
          user_id: user.id,
          season_id: typedSeason.id,
          name: `${typedSeason.name}`,
          is_public: true,
          layout: [],
        })
        .select()
        .single()

      if (createError) {
        console.error('Space creation error:', createError)
        return errorResponse(
          ErrorCodes.DATABASE_ERROR,
          '공간 생성에 실패했습니다.',
          500
        )
      }

      spaceData = newSpace
    } else if (spaceError) {
      console.error('Space fetch error:', spaceError)
      return errorResponse(
        ErrorCodes.DATABASE_ERROR,
        '공간 조회에 실패했습니다.',
        500
      )
    }

    const typedSpace = spaceData as SpaceRow
    const layout = typedSpace.layout || []

    // 배치된 오브젝트 정보 조회
    let placedObjects: (ObjectPlacement & { object: PixeloObject })[] = []

    if (layout.length > 0) {
      const objectIds = layout.map((item) => item.objectId)

      const { data: objectsData, error: objectsError } = await supabase
        .from('objects')
        .select(
          `
          *,
          object_categories (
            id,
            code,
            name,
            layer_order
          )
        `
        )
        .in('id', objectIds)

      if (objectsError) {
        console.error('Objects fetch error:', objectsError)
      } else if (objectsData) {
        const objectsMap = new Map<string, PixeloObject>()
        for (const obj of objectsData as ObjectRow[]) {
          objectsMap.set(obj.id, mapObjectRowToPixeloObject(obj))
        }

        placedObjects = layout
          .map((placement) => {
            const object = objectsMap.get(placement.objectId)
            if (!object) return null
            return {
              ...placement,
              object,
            }
          })
          .filter(
            (item): item is ObjectPlacement & { object: PixeloObject } =>
              item !== null
          )
      }
    }

    return successResponse({
      space: mapSpaceRowToUserSpace(typedSpace),
      placedObjects,
      season: {
        id: typedSeason.id,
        seasonNumber: typedSeason.season_number,
        name: typedSeason.name,
        description: typedSeason.description,
        spaceType: typedSeason.space_type,
        spaceBackgroundUrl: typedSeason.space_background_url,
        totalQuestions: typedSeason.total_questions,
        totalDays: typedSeason.total_days,
        isActive: typedSeason.is_active,
        startDate: typedSeason.start_date,
        endDate: typedSeason.end_date,
      },
    })
  } catch (error) {
    return handleError(error)
  }
}

// =============================================================================
// PUT /api/space/[season] - 공간 수정
// =============================================================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ season: string }> }
) {
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

    const { season } = await params
    const seasonNumber = parseInt(season, 10)

    // 시즌 번호 유효성 검증
    if (isNaN(seasonNumber) || seasonNumber < 1) {
      throw new ValidationError('유효하지 않은 시즌 번호입니다.')
    }

    // 요청 본문 파싱 및 유효성 검증
    const body = await request.json()
    const validatedData = updateSpaceSchema.parse(body)

    // 시즌 정보 조회
    const { data: seasonData, error: seasonError } = await supabase
      .from('seasons')
      .select('id')
      .eq('season_number', seasonNumber)
      .single()

    if (seasonError || !seasonData) {
      throw new NotFoundError('시즌')
    }

    // 사용자 공간 조회
    const { data: existingSpace, error: spaceError } = await supabase
      .from('spaces')
      .select('id')
      .eq('user_id', user.id)
      .eq('season_id', seasonData.id)
      .single()

    if (spaceError && spaceError.code === 'PGRST116') {
      throw new NotFoundError('공간')
    }

    if (spaceError) {
      console.error('Space fetch error:', spaceError)
      return errorResponse(
        ErrorCodes.DATABASE_ERROR,
        '공간 조회에 실패했습니다.',
        500
      )
    }

    // layout 유효성 검증: 모든 오브젝트가 사용자 소유인지 확인
    if (validatedData.layout && validatedData.layout.length > 0) {
      const objectIds = validatedData.layout.map((item) => item.objectId)

      const { data: userObjects, error: userObjectsError } = await supabase
        .from('user_objects')
        .select('object_id')
        .eq('user_id', user.id)
        .in('object_id', objectIds)

      if (userObjectsError) {
        console.error('User objects check error:', userObjectsError)
        return errorResponse(
          ErrorCodes.DATABASE_ERROR,
          '오브젝트 소유권 확인에 실패했습니다.',
          500
        )
      }

      const ownedObjectIds = new Set(
        userObjects?.map((uo) => uo.object_id) || []
      )
      const unownedObjects = objectIds.filter((id) => !ownedObjectIds.has(id))

      if (unownedObjects.length > 0) {
        throw new ValidationError(
          '소유하지 않은 오브젝트가 포함되어 있습니다.',
          { unownedObjectIds: unownedObjects }
        )
      }
    }

    // 업데이트할 데이터 구성
    const updateData: Record<string, unknown> = {
      last_edited_at: new Date().toISOString(),
    }

    if (validatedData.layout !== undefined) {
      updateData.layout = validatedData.layout
    }
    if (validatedData.backgroundVariant !== undefined) {
      updateData.background_variant = validatedData.backgroundVariant
    }
    if (validatedData.name !== undefined) {
      updateData.name = validatedData.name
    }
    if (validatedData.isPublic !== undefined) {
      updateData.is_public = validatedData.isPublic
    }

    // 공간 업데이트
    const { data: updatedSpace, error: updateError } = await supabase
      .from('spaces')
      .update(updateData)
      .eq('id', existingSpace.id)
      .select()
      .single()

    if (updateError) {
      console.error('Space update error:', updateError)
      return errorResponse(
        ErrorCodes.DATABASE_ERROR,
        '공간 수정에 실패했습니다.',
        500
      )
    }

    return successResponse({
      space: mapSpaceRowToUserSpace(updatedSpace as SpaceRow),
      message: '공간이 성공적으로 수정되었습니다.',
    })
  } catch (error) {
    return handleError(error)
  }
}
