import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { noContentResponse, handleError, errorResponse } from '@/lib/api/response'
import {
  UnauthorizedError,
  NotFoundError,
  ValidationError,
  ErrorCodes,
  SpaceErrorCodes,
} from '@/lib/api/errors'
import type { ObjectPlacement } from '@/types'

// =============================================================================
// DELETE /api/objects/place/[objectId] - 오브젝트 제거
// =============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ objectId: string }> }
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

    const { objectId } = await params

    // UUID 형식 검증
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(objectId)) {
      throw new ValidationError('유효한 오브젝트 ID가 필요합니다.')
    }

    // URL 쿼리 파라미터에서 seasonId 추출 (선택적)
    const { searchParams } = new URL(request.url)
    const seasonId = searchParams.get('seasonId')

    // seasonId가 제공된 경우 해당 시즌의 공간에서만 제거
    // 제공되지 않은 경우 모든 공간에서 제거
    if (seasonId) {
      // UUID 형식 검증
      if (!uuidRegex.test(seasonId)) {
        throw new ValidationError('유효한 시즌 ID가 필요합니다.')
      }

      // 특정 시즌의 공간에서 오브젝트 제거
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
    } else {
      // 모든 공간에서 해당 오브젝트 제거
      const { data: spacesData, error: spacesError } = await supabase
        .from('spaces')
        .select('id, layout')
        .eq('user_id', user.id)

      if (spacesError) {
        console.error('Spaces fetch error:', spacesError)
        return errorResponse(
          ErrorCodes.DATABASE_ERROR,
          '공간 조회에 실패했습니다.',
          500
        )
      }

      if (!spacesData || spacesData.length === 0) {
        throw new NotFoundError('공간')
      }

      let objectFound = false

      // 각 공간에서 오브젝트 제거
      for (const space of spacesData as { id: string; layout: ObjectPlacement[] }[]) {
        const currentLayout: ObjectPlacement[] = space.layout || []
        const objectIndex = currentLayout.findIndex(
          (item) => item.objectId === objectId
        )

        if (objectIndex !== -1) {
          objectFound = true
          const updatedLayout = currentLayout.filter(
            (item) => item.objectId !== objectId
          )

          const { error: updateError } = await supabase
            .from('spaces')
            .update({
              layout: updatedLayout,
              last_edited_at: new Date().toISOString(),
            })
            .eq('id', space.id)

          if (updateError) {
            console.error('Space update error:', updateError)
            return errorResponse(
              ErrorCodes.DATABASE_ERROR,
              '오브젝트 제거에 실패했습니다.',
              500
            )
          }
        }
      }

      if (!objectFound) {
        return errorResponse(
          SpaceErrorCodes.OBJECT_NOT_OWNED,
          '배치되지 않은 오브젝트입니다.',
          404
        )
      }
    }

    return noContentResponse()
  } catch (error) {
    return handleError(error)
  }
}
