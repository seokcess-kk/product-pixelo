/**
 * Score Calculator Unit Tests
 *
 * 7개 측정축 점수 계산 로직 테스트
 */

import {
  AxisCode,
  ALL_AXIS_CODES,
  AXIS_METADATA,
  calculateAxisScore,
  calculateAllScores,
  normalizeScore,
  getScoreRangeLabel,
  getAxisTendencyDescription,
  scoreToPercentage,
  percentageToScore,
  calculateSimilarity,
  toRadarChartData,
  updateAxisScore,
  type AnswerData,
  type AxisScoreData,
} from '../score-calculator'

describe('score-calculator', () => {
  describe('AxisCode', () => {
    it('should have 7 axis codes', () => {
      expect(ALL_AXIS_CODES).toHaveLength(7)
    })

    it('should have correct axis codes', () => {
      expect(ALL_AXIS_CODES).toContain('energy')
      expect(ALL_AXIS_CODES).toContain('lifestyle')
      expect(ALL_AXIS_CODES).toContain('emotion')
      expect(ALL_AXIS_CODES).toContain('aesthetic')
      expect(ALL_AXIS_CODES).toContain('social')
      expect(ALL_AXIS_CODES).toContain('challenge')
      expect(ALL_AXIS_CODES).toContain('relationship')
    })

    it('should have metadata for all axes', () => {
      for (const axisCode of ALL_AXIS_CODES) {
        expect(AXIS_METADATA[axisCode]).toBeDefined()
        expect(AXIS_METADATA[axisCode].name).toBeTruthy()
        expect(AXIS_METADATA[axisCode].lowEndName).toBeTruthy()
        expect(AXIS_METADATA[axisCode].highEndName).toBeTruthy()
      }
    })
  })

  describe('calculateAxisScore', () => {
    it('should return null for empty answers', () => {
      const result = calculateAxisScore([], AxisCode.ENERGY)
      expect(result).toBeNull()
    })

    it('should return null when no answers match the axis', () => {
      const answers: AnswerData[] = [
        { questionId: 'q1', choiceId: 'c1', axisCode: AxisCode.LIFESTYLE, scoreValue: 3 },
      ]
      const result = calculateAxisScore(answers, AxisCode.ENERGY)
      expect(result).toBeNull()
    })

    it('should calculate score for single answer', () => {
      const answers: AnswerData[] = [
        { questionId: 'q1', choiceId: 'c1', axisCode: AxisCode.ENERGY, scoreValue: 4 },
      ]
      const result = calculateAxisScore(answers, AxisCode.ENERGY)

      expect(result).not.toBeNull()
      expect(result!.axisCode).toBe(AxisCode.ENERGY)
      expect(result!.totalScore).toBe(4)
      expect(result!.answerCount).toBe(1)
      expect(result!.averageScore).toBe(4)
      expect(result!.finalScore).toBe(4)
    })

    it('should calculate average score for multiple answers', () => {
      const answers: AnswerData[] = [
        { questionId: 'q1', choiceId: 'c1', axisCode: AxisCode.ENERGY, scoreValue: 2 },
        { questionId: 'q2', choiceId: 'c2', axisCode: AxisCode.ENERGY, scoreValue: 4 },
        { questionId: 'q3', choiceId: 'c3', axisCode: AxisCode.ENERGY, scoreValue: 5 },
      ]
      const result = calculateAxisScore(answers, AxisCode.ENERGY)

      expect(result).not.toBeNull()
      expect(result!.totalScore).toBe(11)
      expect(result!.answerCount).toBe(3)
      expect(result!.averageScore).toBeCloseTo(3.67, 2)
      expect(result!.finalScore).toBe(4) // round(3.67) = 4
    })

    it('should only consider answers for the specified axis', () => {
      const answers: AnswerData[] = [
        { questionId: 'q1', choiceId: 'c1', axisCode: AxisCode.ENERGY, scoreValue: 5 },
        { questionId: 'q2', choiceId: 'c2', axisCode: AxisCode.LIFESTYLE, scoreValue: 1 },
        { questionId: 'q3', choiceId: 'c3', axisCode: AxisCode.ENERGY, scoreValue: 3 },
      ]
      const result = calculateAxisScore(answers, AxisCode.ENERGY)

      expect(result!.answerCount).toBe(2)
      expect(result!.totalScore).toBe(8)
      expect(result!.averageScore).toBe(4)
    })
  })

  describe('calculateAllScores', () => {
    it('should return empty scores for no answers', () => {
      const result = calculateAllScores([])

      expect(result.scores.size).toBe(0)
      expect(result.totalAnswers).toBe(0)
      expect(result.completedAxes).toBe(0)
    })

    it('should calculate scores for all axes with answers', () => {
      const answers: AnswerData[] = [
        { questionId: 'q1', choiceId: 'c1', axisCode: AxisCode.ENERGY, scoreValue: 4 },
        { questionId: 'q2', choiceId: 'c2', axisCode: AxisCode.LIFESTYLE, scoreValue: 2 },
        { questionId: 'q3', choiceId: 'c3', axisCode: AxisCode.EMOTION, scoreValue: 5 },
      ]
      const result = calculateAllScores(answers)

      expect(result.totalAnswers).toBe(3)
      expect(result.completedAxes).toBe(3)
      expect(result.scores.has(AxisCode.ENERGY)).toBe(true)
      expect(result.scores.has(AxisCode.LIFESTYLE)).toBe(true)
      expect(result.scores.has(AxisCode.EMOTION)).toBe(true)
      expect(result.scores.has(AxisCode.AESTHETIC)).toBe(false)
    })
  })

  describe('normalizeScore', () => {
    it('should return 1 for scores below 1', () => {
      expect(normalizeScore(0)).toBe(1)
      expect(normalizeScore(-1)).toBe(1)
    })

    it('should return 5 for scores above 5', () => {
      expect(normalizeScore(6)).toBe(5)
      expect(normalizeScore(10)).toBe(5)
    })

    it('should round scores correctly', () => {
      expect(normalizeScore(1.4)).toBe(1)
      expect(normalizeScore(1.5)).toBe(2)
      expect(normalizeScore(2.5)).toBe(3)
      expect(normalizeScore(3.49)).toBe(3)
      expect(normalizeScore(4.5)).toBe(5)
    })
  })

  describe('getScoreRangeLabel', () => {
    it('should return correct label for low scores', () => {
      const label = getScoreRangeLabel(1.5)
      expect(label.label).toBe('매우 낮음')
    })

    it('should return correct label for neutral scores', () => {
      const label = getScoreRangeLabel(3.0)
      expect(label.label).toBe('중립')
    })

    it('should return correct label for high scores', () => {
      const label = getScoreRangeLabel(4.5)
      expect(label.label).toBe('매우 높음')
    })
  })

  describe('getAxisTendencyDescription', () => {
    it('should describe low tendency correctly', () => {
      const desc = getAxisTendencyDescription(AxisCode.ENERGY, 2.0)
      expect(desc).toContain('내향')
      expect(desc).toContain('강합니다')
    })

    it('should describe high tendency correctly', () => {
      const desc = getAxisTendencyDescription(AxisCode.ENERGY, 4.0)
      expect(desc).toContain('외향')
      expect(desc).toContain('강합니다')
    })

    it('should describe neutral tendency correctly', () => {
      const desc = getAxisTendencyDescription(AxisCode.ENERGY, 3.0)
      expect(desc).toContain('균형')
    })
  })

  describe('scoreToPercentage / percentageToScore', () => {
    it('should convert score 1 to 0%', () => {
      expect(scoreToPercentage(1)).toBe(0)
    })

    it('should convert score 5 to 100%', () => {
      expect(scoreToPercentage(5)).toBe(100)
    })

    it('should convert score 3 to 50%', () => {
      expect(scoreToPercentage(3)).toBe(50)
    })

    it('should convert 0% back to score 1', () => {
      expect(percentageToScore(0)).toBe(1)
    })

    it('should convert 100% back to score 5', () => {
      expect(percentageToScore(100)).toBe(5)
    })

    it('should be reversible', () => {
      for (let score = 1; score <= 5; score += 0.5) {
        expect(percentageToScore(scoreToPercentage(score))).toBeCloseTo(score, 5)
      }
    })
  })

  describe('calculateSimilarity', () => {
    it('should return 100% for identical scores', () => {
      const scores: Map<AxisCode, AxisScoreData> = new Map([
        [AxisCode.ENERGY, { axisCode: AxisCode.ENERGY, totalScore: 12, answerCount: 3, averageScore: 4, finalScore: 4 }],
        [AxisCode.LIFESTYLE, { axisCode: AxisCode.LIFESTYLE, totalScore: 6, answerCount: 3, averageScore: 2, finalScore: 2 }],
      ])

      const similarity = calculateSimilarity(scores, scores)
      expect(similarity).toBe(100)
    })

    it('should return 0% for completely opposite scores', () => {
      const scores1: Map<AxisCode, AxisScoreData> = new Map([
        [AxisCode.ENERGY, { axisCode: AxisCode.ENERGY, totalScore: 1, answerCount: 1, averageScore: 1, finalScore: 1 }],
      ])
      const scores2: Map<AxisCode, AxisScoreData> = new Map([
        [AxisCode.ENERGY, { axisCode: AxisCode.ENERGY, totalScore: 5, answerCount: 1, averageScore: 5, finalScore: 5 }],
      ])

      const similarity = calculateSimilarity(scores1, scores2)
      expect(similarity).toBe(0)
    })

    it('should return 0 when no common axes', () => {
      const scores1: Map<AxisCode, AxisScoreData> = new Map([
        [AxisCode.ENERGY, { axisCode: AxisCode.ENERGY, totalScore: 3, answerCount: 1, averageScore: 3, finalScore: 3 }],
      ])
      const scores2: Map<AxisCode, AxisScoreData> = new Map([
        [AxisCode.LIFESTYLE, { axisCode: AxisCode.LIFESTYLE, totalScore: 3, answerCount: 1, averageScore: 3, finalScore: 3 }],
      ])

      const similarity = calculateSimilarity(scores1, scores2)
      expect(similarity).toBe(0)
    })
  })

  describe('toRadarChartData', () => {
    it('should return data for all 7 axes', () => {
      const scores: Map<AxisCode, AxisScoreData> = new Map([
        [AxisCode.ENERGY, { axisCode: AxisCode.ENERGY, totalScore: 4, answerCount: 1, averageScore: 4, finalScore: 4 }],
      ])

      const chartData = toRadarChartData(scores)

      expect(chartData).toHaveLength(7)
      expect(chartData.find(d => d.axisCode === AxisCode.ENERGY)?.score).toBe(4)
      // Axes without scores should default to 3
      expect(chartData.find(d => d.axisCode === AxisCode.LIFESTYLE)?.score).toBe(3)
    })

    it('should include correct metadata', () => {
      const scores = new Map<AxisCode, AxisScoreData>()
      const chartData = toRadarChartData(scores)

      const energyData = chartData.find(d => d.axisCode === AxisCode.ENERGY)
      expect(energyData?.axis).toBe('에너지 방향')
      expect(energyData?.lowEnd).toBe('내향')
      expect(energyData?.highEnd).toBe('외향')
    })
  })

  describe('updateAxisScore', () => {
    it('should create new score for null existing', () => {
      const newAnswer: AnswerData = {
        questionId: 'q1',
        choiceId: 'c1',
        axisCode: AxisCode.ENERGY,
        scoreValue: 4,
      }

      const result = updateAxisScore(null, newAnswer)

      expect(result.axisCode).toBe(AxisCode.ENERGY)
      expect(result.totalScore).toBe(4)
      expect(result.answerCount).toBe(1)
      expect(result.averageScore).toBe(4)
      expect(result.finalScore).toBe(4)
    })

    it('should update existing score correctly', () => {
      const existing: AxisScoreData = {
        axisCode: AxisCode.ENERGY,
        totalScore: 8,
        answerCount: 2,
        averageScore: 4,
        finalScore: 4,
      }
      const newAnswer: AnswerData = {
        questionId: 'q3',
        choiceId: 'c3',
        axisCode: AxisCode.ENERGY,
        scoreValue: 2,
      }

      const result = updateAxisScore(existing, newAnswer)

      expect(result.totalScore).toBe(10)
      expect(result.answerCount).toBe(3)
      expect(result.averageScore).toBeCloseTo(3.33, 2)
      expect(result.finalScore).toBe(3)
    })
  })
})
