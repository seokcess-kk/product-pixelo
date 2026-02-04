/**
 * PIXELO - 오브젝트 매핑 모듈
 *
 * 축 점수를 기반으로 획득 가능한 오브젝트를 결정합니다.
 *
 * 획득 조건 타입:
 * 1. axis_score: 특정 축의 점수 범위에 따라 획득
 * 2. day: 특정 일차 완료 시 획득
 * 3. default: 기본 제공 오브젝트
 */

import { AxisCode, AxisScoreData, ALL_AXIS_CODES } from './score-calculator'

/**
 * 오브젝트 카테고리
 */
export const ObjectCategory = {
  BACKGROUND: 'background',
  FURNITURE: 'furniture',
  DECORATION: 'decoration',
  APPLIANCE: 'appliance',
  OUTDOOR: 'outdoor',
  NATURE: 'nature',
  LIGHTING: 'lighting',
} as const

export type ObjectCategory = (typeof ObjectCategory)[keyof typeof ObjectCategory]

/**
 * 공간 타입
 */
export const SpaceType = {
  ROOM: 'room',
  HIDEOUT: 'hideout',
} as const

export type SpaceType = (typeof SpaceType)[keyof typeof SpaceType]

/**
 * 오브젝트 획득 타입
 */
export const AcquisitionType = {
  AXIS_SCORE: 'axis_score',
  DAY: 'day',
  DEFAULT: 'default',
} as const

export type AcquisitionType = (typeof AcquisitionType)[keyof typeof AcquisitionType]

/**
 * 오브젝트 메타데이터 인터페이스
 */
export interface PixelObject {
  id: string
  seasonId: string
  categoryId: string
  name: string
  description?: string
  imageUrl: string
  thumbnailUrl?: string
  axisId?: string
  axisCode?: AxisCode
  minScore?: number // 1-5
  maxScore?: number // 1-5
  defaultX: number
  defaultY: number
  width?: number
  height?: number
  isMovable: boolean
  isResizable: boolean
  acquisitionType: AcquisitionType
  acquisitionDay?: number
}

/**
 * 획득한 오브젝트 인터페이스
 */
export interface AcquiredObject {
  id: string
  objectId: string
  object: PixelObject
  acquiredAt: string
  acquiredReason: string
}

/**
 * 오브젝트 배치 정보
 */
export interface ObjectPlacement {
  objectId: string
  x: number
  y: number
  scale: number
  rotation: number
  zIndex: number
}

/**
 * 공간 구성 정보
 */
export interface SpaceLayout {
  userId: string
  seasonId: string
  spaceType: SpaceType
  placements: ObjectPlacement[]
  backgroundVariant?: string
}

/**
 * 점수 범위 내에 해당하는지 확인합니다.
 *
 * @param score - 확인할 점수 (1-5)
 * @param minScore - 최소 점수
 * @param maxScore - 최대 점수
 * @returns 범위 내 여부
 */
export function isScoreInRange(score: number, minScore?: number, maxScore?: number): boolean {
  if (minScore === undefined && maxScore === undefined) {
    return true // 점수 조건이 없으면 항상 true
  }

  const min = minScore ?? 1
  const max = maxScore ?? 5

  return score >= min && score <= max
}

/**
 * 특정 축 점수에 해당하는 오브젝트를 찾습니다.
 *
 * @param objects - 전체 오브젝트 배열
 * @param axisCode - 측정축 코드
 * @param score - 해당 축의 점수 (1-5)
 * @returns 조건에 맞는 오브젝트 배열
 */
export function getObjectsByAxisScore(
  objects: PixelObject[],
  axisCode: AxisCode,
  score: number
): PixelObject[] {
  return objects.filter((obj) => {
    if (obj.acquisitionType !== AcquisitionType.AXIS_SCORE) {
      return false
    }

    if (obj.axisCode !== axisCode) {
      return false
    }

    return isScoreInRange(score, obj.minScore, obj.maxScore)
  })
}

/**
 * 특정 일차에 획득 가능한 오브젝트를 찾습니다.
 *
 * @param objects - 전체 오브젝트 배열
 * @param day - 일차 (1-24)
 * @returns 해당 일차의 오브젝트 배열
 */
export function getObjectsByDay(objects: PixelObject[], day: number): PixelObject[] {
  return objects.filter(
    (obj) => obj.acquisitionType === AcquisitionType.DAY && obj.acquisitionDay === day
  )
}

/**
 * 기본 제공 오브젝트를 반환합니다.
 *
 * @param objects - 전체 오브젝트 배열
 * @returns 기본 오브젝트 배열
 */
export function getDefaultObjects(objects: PixelObject[]): PixelObject[] {
  return objects.filter((obj) => obj.acquisitionType === AcquisitionType.DEFAULT)
}

/**
 * 사용자의 모든 축 점수를 기반으로 획득 가능한 오브젝트 목록을 반환합니다.
 *
 * @param objects - 전체 오브젝트 배열
 * @param axisScores - 축별 점수 맵
 * @returns 획득 가능한 오브젝트 배열과 획득 사유
 */
export function getAcquirableObjects(
  objects: PixelObject[],
  axisScores: Map<AxisCode, AxisScoreData>
): Array<{ object: PixelObject; reason: string }> {
  const acquirable: Array<{ object: PixelObject; reason: string }> = []

  // 기본 제공 오브젝트
  const defaultObjs = getDefaultObjects(objects)
  for (const obj of defaultObjs) {
    acquirable.push({ object: obj, reason: 'default' })
  }

  // 축 점수 기반 오브젝트
  for (const axisCode of ALL_AXIS_CODES) {
    const scoreData = axisScores.get(axisCode)
    if (!scoreData) continue

    const axisObjects = getObjectsByAxisScore(objects, axisCode, scoreData.finalScore)
    for (const obj of axisObjects) {
      acquirable.push({
        object: obj,
        reason: `axis_${axisCode}_${scoreData.finalScore}`,
      })
    }
  }

  return acquirable
}

/**
 * 특정 공간 타입의 오브젝트만 필터링합니다.
 *
 * @param objects - 오브젝트 배열
 * @param spaceType - 공간 타입 (room, hideout)
 * @param seasonId - 시즌 ID
 * @returns 필터링된 오브젝트 배열
 */
export function filterObjectsBySpace(
  objects: PixelObject[],
  spaceType: SpaceType,
  seasonId: string
): PixelObject[] {
  return objects.filter((obj) => obj.seasonId === seasonId)
}

/**
 * 새 응답 후 획득 가능한 오브젝트를 계산합니다.
 *
 * @param objects - 전체 오브젝트 배열
 * @param currentDay - 현재 진행 일차
 * @param axisCode - 응답한 질문의 축
 * @param newScore - 업데이트된 축 점수
 * @param alreadyAcquiredIds - 이미 획득한 오브젝트 ID 배열
 * @returns 새로 획득 가능한 오브젝트 배열
 */
export function getNewlyAcquirableObjects(
  objects: PixelObject[],
  currentDay: number,
  axisCode: AxisCode,
  newScore: number,
  alreadyAcquiredIds: string[]
): Array<{ object: PixelObject; reason: string }> {
  const newAcquisitions: Array<{ object: PixelObject; reason: string }> = []

  // 이미 획득하지 않은 오브젝트만 대상
  const notAcquiredObjects = objects.filter((obj) => !alreadyAcquiredIds.includes(obj.id))

  // 일차 기반 오브젝트 확인
  const dayObjects = getObjectsByDay(notAcquiredObjects, currentDay)
  for (const obj of dayObjects) {
    newAcquisitions.push({
      object: obj,
      reason: `day_${currentDay}`,
    })
  }

  // 해당 축 점수 기반 오브젝트 확인
  const axisObjects = getObjectsByAxisScore(notAcquiredObjects, axisCode, newScore)
  for (const obj of axisObjects) {
    // 중복 체크 (같은 오브젝트가 일차로도 획득 가능한 경우)
    if (!newAcquisitions.some((acq) => acq.object.id === obj.id)) {
      newAcquisitions.push({
        object: obj,
        reason: `axis_${axisCode}_${newScore}`,
      })
    }
  }

  return newAcquisitions
}

/**
 * 전체 공간에 필요한 오브젝트 목록을 반환합니다.
 *
 * @param acquiredObjects - 획득한 오브젝트 배열
 * @param spaceType - 공간 타입
 * @returns 해당 공간용 오브젝트 배열
 */
export function getObjectsForSpace(
  acquiredObjects: AcquiredObject[],
  spaceType: SpaceType
): AcquiredObject[] {
  // 시즌에 따른 공간 타입 매핑 (시즌1 = room, 시즌2 = hideout)
  // 실제 구현에서는 시즌 정보를 기반으로 필터링
  return acquiredObjects
}

/**
 * 점수에 해당하는 오브젝트 변형(variant)을 결정합니다.
 *
 * @param baseObjectId - 기본 오브젝트 ID
 * @param axisCode - 측정축
 * @param score - 점수 (1-5)
 * @returns 변형 코드
 */
export function getObjectVariant(axisCode: AxisCode, score: number): string {
  // 점수에 따른 변형 코드 생성
  // 예: energy_1 (내향 극단), energy_5 (외향 극단)
  return `${axisCode}_${score}`
}

/**
 * 오브젝트 배치 유효성을 검사합니다.
 *
 * @param placement - 배치 정보
 * @param gridWidth - 그리드 너비
 * @param gridHeight - 그리드 높이
 * @param existingPlacements - 기존 배치 목록
 * @returns 유효성 여부
 */
export function validatePlacement(
  placement: ObjectPlacement,
  gridWidth: number,
  gridHeight: number,
  existingPlacements: ObjectPlacement[]
): { valid: boolean; reason?: string } {
  // 그리드 범위 체크
  if (placement.x < 0 || placement.x >= gridWidth) {
    return { valid: false, reason: 'X 좌표가 그리드 범위를 벗어났습니다.' }
  }

  if (placement.y < 0 || placement.y >= gridHeight) {
    return { valid: false, reason: 'Y 좌표가 그리드 범위를 벗어났습니다.' }
  }

  // 스케일 범위 체크
  if (placement.scale < 0.5 || placement.scale > 2) {
    return { valid: false, reason: '스케일은 0.5 ~ 2 범위여야 합니다.' }
  }

  // 회전 값 체크
  if (![0, 90, 180, 270].includes(placement.rotation)) {
    return { valid: false, reason: '회전은 0, 90, 180, 270도만 가능합니다.' }
  }

  // 중복 배치 체크 (동일 오브젝트가 이미 배치된 경우)
  const duplicate = existingPlacements.find(
    (p) => p.objectId === placement.objectId && p.objectId !== placement.objectId
  )
  if (duplicate) {
    return { valid: false, reason: '이미 배치된 오브젝트입니다.' }
  }

  return { valid: true }
}

/**
 * DB에서 가져온 오브젝트 데이터를 PixelObject 형식으로 변환합니다.
 *
 * @param dbObject - DB 오브젝트 데이터
 * @returns PixelObject 형식
 */
export function transformDbObject(dbObject: {
  id: string
  season_id: string
  category_id: string
  name: string
  description?: string
  image_url: string
  thumbnail_url?: string
  axis_id?: string
  min_score?: number
  max_score?: number
  default_x: number
  default_y: number
  width?: number
  height?: number
  is_movable: boolean
  is_resizable: boolean
  acquisition_type: string
  acquisition_day?: number
  axis?: {
    axis_code: string
  }
}): PixelObject {
  return {
    id: dbObject.id,
    seasonId: dbObject.season_id,
    categoryId: dbObject.category_id,
    name: dbObject.name,
    description: dbObject.description,
    imageUrl: dbObject.image_url,
    thumbnailUrl: dbObject.thumbnail_url,
    axisId: dbObject.axis_id,
    axisCode: dbObject.axis?.axis_code as AxisCode | undefined,
    minScore: dbObject.min_score,
    maxScore: dbObject.max_score,
    defaultX: dbObject.default_x,
    defaultY: dbObject.default_y,
    width: dbObject.width,
    height: dbObject.height,
    isMovable: dbObject.is_movable,
    isResizable: dbObject.is_resizable,
    acquisitionType: dbObject.acquisition_type as AcquisitionType,
    acquisitionDay: dbObject.acquisition_day,
  }
}

/**
 * 공간 레이아웃을 DB 형식으로 변환합니다.
 *
 * @param layout - 공간 레이아웃
 * @returns DB 저장용 JSON
 */
export function layoutToDbFormat(
  placements: ObjectPlacement[]
): Array<{
  object_id: string
  x: number
  y: number
  scale: number
  rotation: number
  z_index: number
}> {
  return placements.map((p) => ({
    object_id: p.objectId,
    x: p.x,
    y: p.y,
    scale: p.scale,
    rotation: p.rotation,
    z_index: p.zIndex,
  }))
}

/**
 * DB에서 가져온 레이아웃을 ObjectPlacement 배열로 변환합니다.
 *
 * @param dbLayout - DB 레이아웃 JSON
 * @returns ObjectPlacement 배열
 */
export function dbLayoutToPlacements(
  dbLayout: Array<{
    object_id: string
    x: number
    y: number
    scale: number
    rotation: number
    z_index: number
  }>
): ObjectPlacement[] {
  return dbLayout.map((item) => ({
    objectId: item.object_id,
    x: item.x,
    y: item.y,
    scale: item.scale,
    rotation: item.rotation,
    zIndex: item.z_index,
  }))
}

/**
 * 축별 오브젝트 매핑 테이블 생성
 * (시즌별로 각 축의 점수 범위에 해당하는 오브젝트 목록)
 *
 * @param objects - 전체 오브젝트 배열
 * @returns 축 -> 점수 -> 오브젝트[] 맵
 */
export function buildAxisObjectMap(
  objects: PixelObject[]
): Map<AxisCode, Map<number, PixelObject[]>> {
  const axisObjectMap = new Map<AxisCode, Map<number, PixelObject[]>>()

  for (const axisCode of ALL_AXIS_CODES) {
    const scoreMap = new Map<number, PixelObject[]>()

    for (let score = 1; score <= 5; score++) {
      const matchingObjects = objects.filter((obj) => {
        if (obj.acquisitionType !== AcquisitionType.AXIS_SCORE) return false
        if (obj.axisCode !== axisCode) return false
        return isScoreInRange(score, obj.minScore, obj.maxScore)
      })

      scoreMap.set(score, matchingObjects)
    }

    axisObjectMap.set(axisCode, scoreMap)
  }

  return axisObjectMap
}
