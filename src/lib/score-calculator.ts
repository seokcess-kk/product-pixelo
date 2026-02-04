/**
 * PIXELO - 7개 측정축 점수 계산 모듈
 *
 * 측정축:
 * 1. energy (에너지 방향): 내향 - 외향
 * 2. lifestyle (생활 패턴): 루틴 - 즉흥
 * 3. emotion (감성 스타일): 이성 - 감성
 * 4. aesthetic (미적 취향): 미니멀 - 맥시멀
 * 5. social (사회적 성향): 개인 - 협력
 * 6. challenge (도전 성향): 안정 - 모험
 * 7. relationship (관계 방식): 깊은관계 - 넓은관계
 *
 * 점수 체계:
 * - 각 선택지는 1~5 점수를 부여
 * - 1: 스펙트럼 왼쪽 극단 (내향, 루틴, 이성 등)
 * - 5: 스펙트럼 오른쪽 극단 (외향, 즉흥, 감성 등)
 * - 축별 평균 점수 계산 후 1~5 스펙트럼으로 표현
 */

/**
 * 측정축 코드 타입
 */
export const AxisCode = {
  ENERGY: 'energy',
  LIFESTYLE: 'lifestyle',
  EMOTION: 'emotion',
  AESTHETIC: 'aesthetic',
  SOCIAL: 'social',
  CHALLENGE: 'challenge',
  RELATIONSHIP: 'relationship',
} as const

export type AxisCode = (typeof AxisCode)[keyof typeof AxisCode]

/**
 * 모든 측정축 코드 배열
 */
export const ALL_AXIS_CODES: AxisCode[] = [
  AxisCode.ENERGY,
  AxisCode.LIFESTYLE,
  AxisCode.EMOTION,
  AxisCode.AESTHETIC,
  AxisCode.SOCIAL,
  AxisCode.CHALLENGE,
  AxisCode.RELATIONSHIP,
]

/**
 * 측정축 메타데이터
 */
export const AXIS_METADATA: Record<
  AxisCode,
  {
    name: string
    nameEn: string
    lowEndName: string
    highEndName: string
    description: string
  }
> = {
  [AxisCode.ENERGY]: {
    name: '에너지 방향',
    nameEn: 'Energy Direction',
    lowEndName: '내향',
    highEndName: '외향',
    description: '에너지를 얻는 방식',
  },
  [AxisCode.LIFESTYLE]: {
    name: '생활 패턴',
    nameEn: 'Life Pattern',
    lowEndName: '루틴',
    highEndName: '즉흥',
    description: '일상 생활 스타일',
  },
  [AxisCode.EMOTION]: {
    name: '감성 스타일',
    nameEn: 'Emotional Style',
    lowEndName: '이성',
    highEndName: '감성',
    description: '의사결정 방식',
  },
  [AxisCode.AESTHETIC]: {
    name: '미적 취향',
    nameEn: 'Aesthetic Taste',
    lowEndName: '미니멀',
    highEndName: '맥시멀',
    description: '선호하는 스타일',
  },
  [AxisCode.SOCIAL]: {
    name: '사회적 성향',
    nameEn: 'Social Tendency',
    lowEndName: '개인',
    highEndName: '협력',
    description: '업무/활동 선호도',
  },
  [AxisCode.CHALLENGE]: {
    name: '도전 성향',
    nameEn: 'Challenge Attitude',
    lowEndName: '안정',
    highEndName: '모험',
    description: '변화에 대한 태도',
  },
  [AxisCode.RELATIONSHIP]: {
    name: '관계 방식',
    nameEn: 'Relationship Style',
    lowEndName: '깊은관계',
    highEndName: '넓은관계',
    description: '인간관계 스타일',
  },
}

/**
 * 응답 데이터 인터페이스
 */
export interface AnswerData {
  questionId: string
  choiceId: string
  axisCode: AxisCode
  scoreValue: number // 1-5
}

/**
 * 축별 점수 집계 데이터
 */
export interface AxisScoreData {
  axisCode: AxisCode
  totalScore: number
  answerCount: number
  averageScore: number // 1.00 - 5.00
  finalScore: number // 1-5 (반올림)
}

/**
 * 전체 점수 계산 결과
 */
export interface AllScoresResult {
  scores: Map<AxisCode, AxisScoreData>
  totalAnswers: number
  completedAxes: number // 1개 이상 응답이 있는 축 수
}

/**
 * 점수 구간 레이블
 */
export interface ScoreRangeLabel {
  range: [number, number]
  label: string
  description: string
}

/**
 * 축별 점수 구간 정의
 */
export const SCORE_RANGES: ScoreRangeLabel[] = [
  { range: [1.0, 1.8], label: '매우 낮음', description: '스펙트럼 왼쪽 극단 성향' },
  { range: [1.81, 2.6], label: '낮음', description: '왼쪽 성향 우세' },
  { range: [2.61, 3.4], label: '중립', description: '균형 잡힌 성향' },
  { range: [3.41, 4.2], label: '높음', description: '오른쪽 성향 우세' },
  { range: [4.21, 5.0], label: '매우 높음', description: '스펙트럼 오른쪽 극단 성향' },
]

/**
 * 단일 축의 점수를 계산합니다.
 *
 * @param answers - 해당 축에 대한 응답 배열
 * @param axisCode - 계산할 축 코드
 * @returns 축 점수 데이터 또는 응답이 없으면 null
 */
export function calculateAxisScore(answers: AnswerData[], axisCode: AxisCode): AxisScoreData | null {
  // 해당 축에 해당하는 응답만 필터링
  const axisAnswers = answers.filter((answer) => answer.axisCode === axisCode)

  if (axisAnswers.length === 0) {
    return null
  }

  // 총점 계산
  const totalScore = axisAnswers.reduce((sum, answer) => sum + answer.scoreValue, 0)

  // 평균 점수 계산 (소수점 2자리)
  const averageScore = Number((totalScore / axisAnswers.length).toFixed(2))

  // 최종 점수 (1-5 정수로 반올림)
  const finalScore = normalizeScore(averageScore)

  return {
    axisCode,
    totalScore,
    answerCount: axisAnswers.length,
    averageScore,
    finalScore,
  }
}

/**
 * 모든 측정축의 점수를 계산합니다.
 *
 * @param answers - 전체 응답 배열
 * @returns 모든 축의 점수 계산 결과
 */
export function calculateAllScores(answers: AnswerData[]): AllScoresResult {
  const scores = new Map<AxisCode, AxisScoreData>()
  let completedAxes = 0

  for (const axisCode of ALL_AXIS_CODES) {
    const axisScore = calculateAxisScore(answers, axisCode)
    if (axisScore) {
      scores.set(axisCode, axisScore)
      completedAxes++
    }
  }

  return {
    scores,
    totalAnswers: answers.length,
    completedAxes,
  }
}

/**
 * 평균 점수를 1~5 정수 스펙트럼으로 정규화합니다.
 *
 * @param rawScore - 원시 평균 점수 (1.00 - 5.00)
 * @returns 정규화된 점수 (1-5 정수)
 */
export function normalizeScore(rawScore: number): number {
  // 범위 체크
  if (rawScore < 1) return 1
  if (rawScore > 5) return 5

  // 반올림하여 1-5 정수로 변환
  return Math.round(rawScore)
}

/**
 * 점수에 해당하는 구간 레이블을 반환합니다.
 *
 * @param score - 평균 점수 (1.00 - 5.00)
 * @returns 점수 구간 레이블
 */
export function getScoreRangeLabel(score: number): ScoreRangeLabel {
  for (const range of SCORE_RANGES) {
    if (score >= range.range[0] && score <= range.range[1]) {
      return range
    }
  }
  // 기본값 (범위 밖인 경우)
  return SCORE_RANGES[2] // 중립
}

/**
 * 축 점수를 기반으로 성향 설명 텍스트를 생성합니다.
 *
 * @param axisCode - 측정축 코드
 * @param averageScore - 평균 점수
 * @returns 성향 설명 텍스트
 */
export function getAxisTendencyDescription(axisCode: AxisCode, averageScore: number): string {
  const metadata = AXIS_METADATA[axisCode]
  const rangeLabel = getScoreRangeLabel(averageScore)

  if (averageScore < 2.5) {
    return `${metadata.lowEndName} 성향이 강합니다.`
  } else if (averageScore > 3.5) {
    return `${metadata.highEndName} 성향이 강합니다.`
  } else {
    return `${metadata.lowEndName}과 ${metadata.highEndName} 사이에서 균형 잡힌 성향입니다.`
  }
}

/**
 * 점수를 백분율로 변환합니다. (레이더 차트 등에서 사용)
 *
 * @param score - 1-5 스펙트럼 점수
 * @returns 0-100 백분율
 */
export function scoreToPercentage(score: number): number {
  // 1-5를 0-100으로 변환
  return ((score - 1) / 4) * 100
}

/**
 * 백분율을 점수로 변환합니다.
 *
 * @param percentage - 0-100 백분율
 * @returns 1-5 스펙트럼 점수
 */
export function percentageToScore(percentage: number): number {
  return (percentage / 100) * 4 + 1
}

/**
 * DB에서 가져온 응답 데이터를 AnswerData 형식으로 변환합니다.
 *
 * @param dbAnswer - DB 응답 데이터
 * @returns AnswerData 형식
 */
export function transformDbAnswer(dbAnswer: {
  questionId: string
  choiceId: string
  choice: {
    axisId: string
    scoreValue: number
    axis: {
      axisCode: string
    }
  }
}): AnswerData {
  return {
    questionId: dbAnswer.questionId,
    choiceId: dbAnswer.choiceId,
    axisCode: dbAnswer.choice.axis.axisCode as AxisCode,
    scoreValue: dbAnswer.choice.scoreValue,
  }
}

/**
 * 두 사용자의 점수를 비교하여 유사도를 계산합니다.
 *
 * @param scores1 - 첫 번째 사용자의 점수 맵
 * @param scores2 - 두 번째 사용자의 점수 맵
 * @returns 유사도 (0-100%)
 */
export function calculateSimilarity(
  scores1: Map<AxisCode, AxisScoreData>,
  scores2: Map<AxisCode, AxisScoreData>
): number {
  let totalDifference = 0
  let comparedAxes = 0

  for (const axisCode of ALL_AXIS_CODES) {
    const score1 = scores1.get(axisCode)
    const score2 = scores2.get(axisCode)

    if (score1 && score2) {
      // 각 축의 차이 계산 (최대 4점 차이 가능)
      const difference = Math.abs(score1.averageScore - score2.averageScore)
      totalDifference += difference
      comparedAxes++
    }
  }

  if (comparedAxes === 0) return 0

  // 최대 차이는 축당 4점, 총 28점 (7축 * 4점)
  const maxDifference = comparedAxes * 4
  const similarity = ((maxDifference - totalDifference) / maxDifference) * 100

  return Math.round(similarity)
}

/**
 * 점수 결과를 레이더 차트용 데이터로 변환합니다.
 *
 * @param scores - 축별 점수 맵
 * @returns 레이더 차트 데이터 배열
 */
export function toRadarChartData(
  scores: Map<AxisCode, AxisScoreData>
): Array<{
  axis: string
  axisCode: AxisCode
  score: number
  percentage: number
  lowEnd: string
  highEnd: string
}> {
  return ALL_AXIS_CODES.map((axisCode) => {
    const scoreData = scores.get(axisCode)
    const metadata = AXIS_METADATA[axisCode]

    return {
      axis: metadata.name,
      axisCode,
      score: scoreData?.averageScore ?? 3, // 기본값 중립
      percentage: scoreData ? scoreToPercentage(scoreData.averageScore) : 50,
      lowEnd: metadata.lowEndName,
      highEnd: metadata.highEndName,
    }
  })
}

/**
 * 응답 데이터를 기반으로 축별 점수를 업데이트합니다.
 * (새 응답이 추가될 때 기존 점수에 반영)
 *
 * @param existingScores - 기존 축별 점수 맵
 * @param newAnswer - 새 응답 데이터
 * @returns 업데이트된 축 점수 데이터
 */
export function updateAxisScore(
  existingScore: AxisScoreData | null,
  newAnswer: AnswerData
): AxisScoreData {
  if (!existingScore) {
    return {
      axisCode: newAnswer.axisCode,
      totalScore: newAnswer.scoreValue,
      answerCount: 1,
      averageScore: newAnswer.scoreValue,
      finalScore: normalizeScore(newAnswer.scoreValue),
    }
  }

  const newTotalScore = existingScore.totalScore + newAnswer.scoreValue
  const newAnswerCount = existingScore.answerCount + 1
  const newAverageScore = Number((newTotalScore / newAnswerCount).toFixed(2))

  return {
    axisCode: existingScore.axisCode,
    totalScore: newTotalScore,
    answerCount: newAnswerCount,
    averageScore: newAverageScore,
    finalScore: normalizeScore(newAverageScore),
  }
}
