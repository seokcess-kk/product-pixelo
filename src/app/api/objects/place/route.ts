import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import {
  successResponse,
  createdResponse,
  noContentResponse,
  handleError,
  errorResponse,
} from '@/lib/api/response'
import {
  UnauthorizedError,
  NotFoundError,
  ValidationError,
  ForbiddenError,
  ErrorCodes,
  SpaceErrorCodes,
} from '@/lib/api/errors'
import type { ObjectPlacement, PixeloObject } from '@/types'

// =============================================================================
// Validation Schemas
// =============================================================================

const placeObjectSchema = z.object({
  objectId: z.string().uuid('유효한 오브젝트 ID가 필요합니다.'),
  seasonId: z.string().uuid('유효한 시즌 ID가 필요합니다.'),
  x: z.number({ required_error: 'X 좌표가 필요합니다.' }),
  y: z.number({ required_error: 'Y 좌표가 필요합니다.' }),
  scale: z.number().min(0.1).max(3).default(1),
  rotation: z.number().min(0).max(360).default(0),
  zIndex: z.number().int().min(0).optional(),
})

// =============================================================================
// Types for DB responses
// =============================================================================

interface SpaceRow {
  id: string
  user_id: string
  season_id: string
  layout: ObjectPlacement[]
}

interface ObjectRow {
  id: string
  season_id: string
  category_id: string
  name: string
  image_url: string
  thumbnail_url: string | null
  default_x: number
  default_y: number
  width: number | null
  height: number | null
  is_movable: boolean
  object_categories: {
    id: string
    code: string
    name: string
    layer_order: number
  }
}

// =============================================================================
// POST /api/objects/place - 오브젝트 배치
// =============================================================================

export async function POST(request: NextRequest) {
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

    // 요청 본문 파싱 및 유효성 검증
    const body = await request.json()
    const validatedData = placeObjectSchema.parse(body)

    // 1. 사용자가 해당 오브젝트를 소유하고 있는지 확인
    const { data: userObject, error: userObjectError } = await supabase
      .from('user_objects')
      .select('id, object_id')
      .eq('user_id', user.id)
      .eq('object_id', validatedData.objectId)
      .single()

    if (userObjectError && userObjectError.code === 'PGRST116') {
      return errorResponse(
        SpaceErrorCodes.OBJECT_NOT_OWNED,
        '소유하지 않은 오브젝트입니다.',
        403
      )
    }

    if (userObjectError) {
      console.error('User object check error:', userObjectError)
      return errorResponse(
        ErrorCodes.DATABASE_ERROR,
        '오브젝트 소유권 확인에 실패했습니다.',
        500
      )
    }

    // 2. 오브젝트 정보 조회 (시즌 검증용)
    const { data: objectData, error: objectError } = await supabase
      .from('objects')
      .select(
        `
        id,
        season_id,
        category_id,
        name,
        image_url,
        thumbnail_url,
        default_x,
        default_y,
        width,
        height,
        is_movable,
        object_categories (
          id,
          code,
          name,
          layer_order
        )
      `
      )
      .eq('id', validatedData.objectId)
      .single()

    if (objectError || !objectData) {
      throw new NotFoundError('오브젝트')
    }

    const typedObject = objectData as ObjectRow

    // 3. 오브젝트가 해당 시즌에 속하는지 확인
    if (typedObject.season_id !== validatedData.seasonId) {
      return errorResponse(
        SpaceErrorCodes.INVALID_SEASON,
        '해당 시즌의 오브젝트가 아닙니다.',
        400
      )
    }

    // 4. 사용자의 해당 시즌 공간 조회 (없으면 생성)
    let { data: spaceData, error: spaceError } = await supabase
      .from('spaces')
      .select('id, user_id, season_id, layout')
      .eq('user_id', user.id)
      .eq('season_id', validatedData.seasonId)
      .single()

    if (spaceError && spaceError.code === 'PGRST116') {
      // 공간이 없으면 생성
      const { data: newSpace, error: createError } = await supabase
        .from('spaces')
        .insert({
          user_id: user.id,
          season_id: validatedData.seasonId,
          is_public: true,
          layout: [],
        })
        .select('id, user_id, season_id, layout')
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
    const currentLayout: ObjectPlacement[] = typedSpace.layout || []

    // 5. 이미 배치된 오브젝트인지 확인
    const existingIndex = currentLayout.findIndex(
      (item) => item.objectId === validatedData.objectId
    )

    // 새 배치 정보 생성
    const maxZIndex =
      currentLayout.length > 0
        ? Math.max(...currentLayout.map((item) => item.zIndex))
        : -1

    const newPlacement: ObjectPlacement = {
      objectId: validatedData.objectId,
      x: validatedData.x,
      y: validatedData.y,
      scale: validatedData.scale,
      rotation: validatedData.rotation,
      zIndex: validatedData.zIndex ?? maxZIndex + 1,
    }

    // 6. 레이아웃 업데이트
    let updatedLayout: ObjectPlacement[]

    if (existingIndex >= 0) {
      // 기존 배치 업데이트
      updatedLayout = [...currentLayout]
      updatedLayout[existingIndex] = newPlacement
    } else {
      // 새로 배치
      updatedLayout = [...currentLayout, newPlacement]
    }

    // 7. 공간 업데이트
    const { error: updateError } = await supabase
      .from('spaces')
      .update({
        layout: updatedLayout,
        last_edited_at: new Date().toISOString(),
      })
      .eq('id', typedSpace.id)

    if (updateError) {
      console.error('Space update error:', updateError)
      return errorResponse(
        ErrorCodes.DATABASE_ERROR,
        '오브젝트 배치에 실패했습니다.',
        500
      )
    }

    return createdResponse({
      placement: newPlacement,
      object: {
        id: typedObject.id,
        name: typedObject.name,
        imageUrl: typedObject.image_url,
        thumbnailUrl: typedObject.thumbnail_url,
        width: typedObject.width,
        height: typedObject.height,
        category: typedObject.object_categories,
      },
      isUpdate: existingIndex >= 0,
      message: existingIndex >= 0
        ? '오브젝트 위치가 업데이트되었습니다.'
        : '오브젝트가 배치되었습니다.',
    })
  } catch (error) {
    return handleError(error)
  }
}

// =============================================================================
// DELETE /api/objects/place - 오브젝트 제거 (쿼리 파라미터 사용)
// =============================================================================

export async function DELETE(request: NextRequest) {
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

    // URL 쿼리 파라미터에서 objectId와 seasonId 추출
    const { searchParams } = new URL(request.url)
    const objectId = searchParams.get('objectId')
    const seasonId = searchParams.get('seasonId')

    if (!objectId) {
      throw new ValidationError('오브젝트 ID가 필요합니다.')
    }

    if (!seasonId) {
      throw new ValidationError('시즌 ID가 필요합니다.')
    }

    // UUID 형식 검증
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(objectId)) {
      throw new ValidationError('유효한 오브젝트 ID가 필요합니다.')
    }
    if (!uuidRegex.test(seasonId)) {
      throw new ValidationError('유효한 시즌 ID가 필요합니다.')
    }

    // 사용자의 해당 시즌 공간 조회
    const { data: spaceData, error: spaceError } = await supabase
      .from('spaces')
      .select('id, layout')
      .eq('user_id', user.id)
      .eq('season_id', seasonId)
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

    const typedSpace = spaceData as { id: string; layout: ObjectPlacement[] }
    const currentLayout: ObjectPlacement[] = typedSpace.layout || []

    // 해당 오브젝트가 배치되어 있는지 확인
    const objectIndex = currentLayout.findIndex(
      (item) => item.objectId === objectId
    )

    if (objectIndex === -1) {
      return errorResponse(
        SpaceErrorCodes.OBJECT_NOT_OWNED,
        '배치되지 않은 오브젝트입니다.',
        404
      )
    }

    // 레이아웃에서 오브젝트 제거
    const updatedLayout = currentLayout.filter(
      (item) => item.objectId !== objectId
    )

    // 공간 업데이트
    const { error: updateError } = await supabase
      .from('spaces')
      .update({
        layout: updatedLayout,
        last_edited_at: new Date().toISOString(),
      })
      .eq('id', typedSpace.id)

    if (updateError) {
      console.error('Space update error:', updateError)
      return errorResponse(
        ErrorCodes.DATABASE_ERROR,
        '오브젝트 제거에 실패했습니다.',
        500
      )
    }

    return noContentResponse()
  } catch (error) {
    return handleError(error)
  }
}
