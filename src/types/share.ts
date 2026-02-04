/**
 * 공유 기능 관련 타입 정의
 */

/**
 * 공유 카드 데이터
 */
export interface ShareCardData {
  nickname: string
  avatarUrl?: string
  seasonName: string
  seasonNumber?: number
  gridSize?: number
  backgroundUrl?: string
}

/**
 * 공유 카드 크기 타입
 */
export const ShareCardSize = {
  STORY: 'story',      // 1080x1920 (인스타 스토리)
  OG: 'og',            // 1200x630 (OG 이미지)
  SQUARE: 'square',    // 1080x1080 (정사각형)
} as const

export type ShareCardSize = (typeof ShareCardSize)[keyof typeof ShareCardSize]

/**
 * 공유 카드 크기 설정
 */
export const SHARE_CARD_DIMENSIONS: Record<ShareCardSize, { width: number; height: number }> = {
  [ShareCardSize.STORY]: { width: 1080, height: 1920 },
  [ShareCardSize.OG]: { width: 1200, height: 630 },
  [ShareCardSize.SQUARE]: { width: 1080, height: 1080 },
}

/**
 * 공유 옵션
 */
export interface ShareOptions {
  size: ShareCardSize
  includeScores: boolean
  includeNickname: boolean
  theme: 'light' | 'dark'
}

/**
 * Kakao 공유 템플릿 데이터
 */
export interface KakaoShareTemplateData {
  title: string
  description: string
  imageUrl: string
  linkUrl: string
  buttonTitle?: string
}

/**
 * 축 점수 요약 (공유 카드용)
 */
export interface AxisScoreSummary {
  axisCode: string
  axisName: string
  score: number
  percentage: number
  lowEndName: string
  highEndName: string
  color: string
}

/**
 * 축별 테마 컬러 매핑
 * key는 AxisCode 문자열 값과 매핑됨
 */
export const AXIS_COLORS: Record<string, { main: string; light: string; dark: string }> = {
  energy: { main: '#FF6B6B', light: '#FFE5E5', dark: '#D63031' },
  lifestyle: { main: '#FFB347', light: '#FFF3E0', dark: '#E67E22' },
  emotion: { main: '#FF85A2', light: '#FFF0F5', dark: '#E84393' },
  aesthetic: { main: '#55EFC4', light: '#E8FFF5', dark: '#00B894' },
  social: { main: '#74B9FF', light: '#E8F8FF', dark: '#0984E3' },
  challenge: { main: '#A855F7', light: '#F3E8FF', dark: '#7C3AED' },
  relationship: { main: '#FDCB6E', light: '#FFFDE8', dark: '#F39C12' },
}
