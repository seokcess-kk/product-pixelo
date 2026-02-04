/**
 * Object Mapper Unit Tests
 *
 * 오브젝트 매핑 및 획득 로직 테스트
 */

import {
  ObjectCategory,
  SpaceType,
  AcquisitionType,
  isScoreInRange,
  getObjectsByAxisScore,
  getObjectsByDay,
  getDefaultObjects,
  getAcquirableObjects,
  getNewlyAcquirableObjects,
  getObjectVariant,
  validatePlacement,
  buildAxisObjectMap,
  layoutToDbFormat,
  dbLayoutToPlacements,
  type PixelObject,
  type ObjectPlacement,
} from '../object-mapper'
import { AxisCode, type AxisScoreData } from '../score-calculator'

// Test fixtures
const createTestObject = (overrides: Partial<PixelObject> = {}): PixelObject => ({
  id: 'obj-1',
  seasonId: 'season-1',
  categoryId: 'cat-1',
  name: 'Test Object',
  imageUrl: '/test.png',
  defaultX: 0,
  defaultY: 0,
  isMovable: true,
  isResizable: false,
  acquisitionType: AcquisitionType.AXIS_SCORE,
  ...overrides,
})

describe('object-mapper', () => {
  describe('Constants', () => {
    it('should have correct object categories', () => {
      expect(ObjectCategory.BACKGROUND).toBe('background')
      expect(ObjectCategory.FURNITURE).toBe('furniture')
      expect(ObjectCategory.DECORATION).toBe('decoration')
      expect(ObjectCategory.LIGHTING).toBe('lighting')
    })

    it('should have correct space types', () => {
      expect(SpaceType.ROOM).toBe('room')
      expect(SpaceType.HIDEOUT).toBe('hideout')
    })

    it('should have correct acquisition types', () => {
      expect(AcquisitionType.AXIS_SCORE).toBe('axis_score')
      expect(AcquisitionType.DAY).toBe('day')
      expect(AcquisitionType.DEFAULT).toBe('default')
    })
  })

  describe('isScoreInRange', () => {
    it('should return true when no range specified', () => {
      expect(isScoreInRange(3, undefined, undefined)).toBe(true)
    })

    it('should return true when score is in range', () => {
      expect(isScoreInRange(3, 2, 4)).toBe(true)
      expect(isScoreInRange(2, 2, 4)).toBe(true) // min boundary
      expect(isScoreInRange(4, 2, 4)).toBe(true) // max boundary
    })

    it('should return false when score is out of range', () => {
      expect(isScoreInRange(1, 2, 4)).toBe(false)
      expect(isScoreInRange(5, 2, 4)).toBe(false)
    })

    it('should handle partial range', () => {
      expect(isScoreInRange(3, 2, undefined)).toBe(true)
      expect(isScoreInRange(1, 2, undefined)).toBe(false)
      expect(isScoreInRange(3, undefined, 4)).toBe(true)
      expect(isScoreInRange(5, undefined, 4)).toBe(false)
    })
  })

  describe('getObjectsByAxisScore', () => {
    const objects: PixelObject[] = [
      createTestObject({
        id: 'obj-1',
        axisCode: AxisCode.ENERGY,
        minScore: 1,
        maxScore: 2,
      }),
      createTestObject({
        id: 'obj-2',
        axisCode: AxisCode.ENERGY,
        minScore: 4,
        maxScore: 5,
      }),
      createTestObject({
        id: 'obj-3',
        axisCode: AxisCode.LIFESTYLE,
        minScore: 1,
        maxScore: 2,
      }),
      createTestObject({
        id: 'obj-4',
        acquisitionType: AcquisitionType.DAY,
        acquisitionDay: 1,
      }),
    ]

    it('should return objects matching axis and score', () => {
      const result = getObjectsByAxisScore(objects, AxisCode.ENERGY, 1)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('obj-1')
    })

    it('should return objects for high scores', () => {
      const result = getObjectsByAxisScore(objects, AxisCode.ENERGY, 5)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('obj-2')
    })

    it('should not return objects for other axes', () => {
      const result = getObjectsByAxisScore(objects, AxisCode.EMOTION, 1)
      expect(result).toHaveLength(0)
    })

    it('should not include day-based objects', () => {
      const result = getObjectsByAxisScore(objects, AxisCode.ENERGY, 3)
      expect(result.find(o => o.id === 'obj-4')).toBeUndefined()
    })
  })

  describe('getObjectsByDay', () => {
    const objects: PixelObject[] = [
      createTestObject({
        id: 'obj-1',
        acquisitionType: AcquisitionType.DAY,
        acquisitionDay: 1,
      }),
      createTestObject({
        id: 'obj-2',
        acquisitionType: AcquisitionType.DAY,
        acquisitionDay: 5,
      }),
      createTestObject({
        id: 'obj-3',
        acquisitionType: AcquisitionType.AXIS_SCORE,
      }),
    ]

    it('should return object for matching day', () => {
      const result = getObjectsByDay(objects, 1)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('obj-1')
    })

    it('should return empty for non-matching day', () => {
      const result = getObjectsByDay(objects, 3)
      expect(result).toHaveLength(0)
    })
  })

  describe('getDefaultObjects', () => {
    const objects: PixelObject[] = [
      createTestObject({
        id: 'obj-1',
        acquisitionType: AcquisitionType.DEFAULT,
      }),
      createTestObject({
        id: 'obj-2',
        acquisitionType: AcquisitionType.DEFAULT,
      }),
      createTestObject({
        id: 'obj-3',
        acquisitionType: AcquisitionType.AXIS_SCORE,
      }),
    ]

    it('should return all default objects', () => {
      const result = getDefaultObjects(objects)
      expect(result).toHaveLength(2)
    })
  })

  describe('getAcquirableObjects', () => {
    const objects: PixelObject[] = [
      createTestObject({
        id: 'default-1',
        acquisitionType: AcquisitionType.DEFAULT,
      }),
      createTestObject({
        id: 'energy-low',
        axisCode: AxisCode.ENERGY,
        minScore: 1,
        maxScore: 2,
      }),
      createTestObject({
        id: 'energy-high',
        axisCode: AxisCode.ENERGY,
        minScore: 4,
        maxScore: 5,
      }),
    ]

    it('should include default objects', () => {
      const axisScores = new Map<AxisCode, AxisScoreData>()
      const result = getAcquirableObjects(objects, axisScores)

      expect(result.some(r => r.object.id === 'default-1')).toBe(true)
      expect(result.some(r => r.reason === 'default')).toBe(true)
    })

    it('should include axis-based objects for matching scores', () => {
      const axisScores = new Map<AxisCode, AxisScoreData>([
        [AxisCode.ENERGY, {
          axisCode: AxisCode.ENERGY,
          totalScore: 4,
          answerCount: 1,
          averageScore: 4,
          finalScore: 4,
        }],
      ])

      const result = getAcquirableObjects(objects, axisScores)

      expect(result.some(r => r.object.id === 'energy-high')).toBe(true)
      expect(result.some(r => r.reason === 'axis_energy_4')).toBe(true)
    })
  })

  describe('getNewlyAcquirableObjects', () => {
    const objects: PixelObject[] = [
      createTestObject({
        id: 'day-5',
        acquisitionType: AcquisitionType.DAY,
        acquisitionDay: 5,
      }),
      createTestObject({
        id: 'energy-4',
        axisCode: AxisCode.ENERGY,
        minScore: 4,
        maxScore: 5,
      }),
      createTestObject({
        id: 'energy-already',
        axisCode: AxisCode.ENERGY,
        minScore: 4,
        maxScore: 5,
      }),
    ]

    it('should return day-based object on matching day', () => {
      const result = getNewlyAcquirableObjects(objects, 5, AxisCode.LIFESTYLE, 3, [])

      expect(result.some(r => r.object.id === 'day-5')).toBe(true)
      expect(result.some(r => r.reason === 'day_5')).toBe(true)
    })

    it('should return axis-based objects for new score', () => {
      const result = getNewlyAcquirableObjects(objects, 1, AxisCode.ENERGY, 4, [])

      expect(result.some(r => r.object.id === 'energy-4')).toBe(true)
    })

    it('should exclude already acquired objects', () => {
      const result = getNewlyAcquirableObjects(
        objects,
        1,
        AxisCode.ENERGY,
        4,
        ['energy-already']
      )

      expect(result.some(r => r.object.id === 'energy-already')).toBe(false)
      expect(result.some(r => r.object.id === 'energy-4')).toBe(true)
    })
  })

  describe('getObjectVariant', () => {
    it('should return correct variant code', () => {
      expect(getObjectVariant(AxisCode.ENERGY, 1)).toBe('energy_1')
      expect(getObjectVariant(AxisCode.LIFESTYLE, 5)).toBe('lifestyle_5')
    })
  })

  describe('validatePlacement', () => {
    const existingPlacements: ObjectPlacement[] = []

    it('should accept valid placement', () => {
      const placement: ObjectPlacement = {
        objectId: 'obj-1',
        x: 5,
        y: 5,
        scale: 1.0,
        rotation: 0,
        zIndex: 1,
      }

      const result = validatePlacement(placement, 10, 10, existingPlacements)
      expect(result.valid).toBe(true)
    })

    it('should reject placement outside grid (X)', () => {
      const placement: ObjectPlacement = {
        objectId: 'obj-1',
        x: 15,
        y: 5,
        scale: 1.0,
        rotation: 0,
        zIndex: 1,
      }

      const result = validatePlacement(placement, 10, 10, existingPlacements)
      expect(result.valid).toBe(false)
      expect(result.reason).toContain('X 좌표')
    })

    it('should reject placement outside grid (Y)', () => {
      const placement: ObjectPlacement = {
        objectId: 'obj-1',
        x: 5,
        y: -1,
        scale: 1.0,
        rotation: 0,
        zIndex: 1,
      }

      const result = validatePlacement(placement, 10, 10, existingPlacements)
      expect(result.valid).toBe(false)
      expect(result.reason).toContain('Y 좌표')
    })

    it('should reject invalid scale', () => {
      const placement: ObjectPlacement = {
        objectId: 'obj-1',
        x: 5,
        y: 5,
        scale: 3.0,
        rotation: 0,
        zIndex: 1,
      }

      const result = validatePlacement(placement, 10, 10, existingPlacements)
      expect(result.valid).toBe(false)
      expect(result.reason).toContain('스케일')
    })

    it('should reject invalid rotation', () => {
      const placement: ObjectPlacement = {
        objectId: 'obj-1',
        x: 5,
        y: 5,
        scale: 1.0,
        rotation: 45,
        zIndex: 1,
      }

      const result = validatePlacement(placement, 10, 10, existingPlacements)
      expect(result.valid).toBe(false)
      expect(result.reason).toContain('회전')
    })

    it('should accept valid rotation values', () => {
      const rotations = [0, 90, 180, 270]

      for (const rotation of rotations) {
        const placement: ObjectPlacement = {
          objectId: 'obj-1',
          x: 5,
          y: 5,
          scale: 1.0,
          rotation,
          zIndex: 1,
        }

        const result = validatePlacement(placement, 10, 10, existingPlacements)
        expect(result.valid).toBe(true)
      }
    })
  })

  describe('buildAxisObjectMap', () => {
    const objects: PixelObject[] = [
      createTestObject({
        id: 'energy-low-1',
        axisCode: AxisCode.ENERGY,
        minScore: 1,
        maxScore: 2,
      }),
      createTestObject({
        id: 'energy-low-2',
        axisCode: AxisCode.ENERGY,
        minScore: 1,
        maxScore: 2,
      }),
      createTestObject({
        id: 'energy-high',
        axisCode: AxisCode.ENERGY,
        minScore: 4,
        maxScore: 5,
      }),
    ]

    it('should build map with all axes', () => {
      const map = buildAxisObjectMap(objects)

      expect(map.has(AxisCode.ENERGY)).toBe(true)
      expect(map.has(AxisCode.LIFESTYLE)).toBe(true)
    })

    it('should map objects to correct scores', () => {
      const map = buildAxisObjectMap(objects)
      const energyMap = map.get(AxisCode.ENERGY)!

      // Score 1 should have 2 objects
      expect(energyMap.get(1)).toHaveLength(2)

      // Score 5 should have 1 object
      expect(energyMap.get(5)).toHaveLength(1)
      expect(energyMap.get(5)![0].id).toBe('energy-high')

      // Score 3 should have 0 objects
      expect(energyMap.get(3)).toHaveLength(0)
    })
  })

  describe('Layout conversion', () => {
    const placements: ObjectPlacement[] = [
      { objectId: 'obj-1', x: 100, y: 200, scale: 1.0, rotation: 0, zIndex: 1 },
      { objectId: 'obj-2', x: 150, y: 250, scale: 1.5, rotation: 90, zIndex: 2 },
    ]

    it('should convert placements to DB format', () => {
      const dbFormat = layoutToDbFormat(placements)

      expect(dbFormat).toHaveLength(2)
      expect(dbFormat[0].object_id).toBe('obj-1')
      expect(dbFormat[0].x).toBe(100)
      expect(dbFormat[0].y).toBe(200)
      expect(dbFormat[0].z_index).toBe(1)
    })

    it('should convert DB format back to placements', () => {
      const dbFormat = [
        { object_id: 'obj-1', x: 100, y: 200, scale: 1.0, rotation: 0, z_index: 1 },
      ]

      const result = dbLayoutToPlacements(dbFormat)

      expect(result).toHaveLength(1)
      expect(result[0].objectId).toBe('obj-1')
      expect(result[0].zIndex).toBe(1)
    })

    it('should be reversible', () => {
      const dbFormat = layoutToDbFormat(placements)
      const restored = dbLayoutToPlacements(dbFormat)

      expect(restored).toEqual(placements)
    })
  })
})
