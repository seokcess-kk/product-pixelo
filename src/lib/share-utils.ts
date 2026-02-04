'use client'

/**
 * 공유 기능 유틸리티
 * - html-to-image를 사용한 이미지 생성
 * - Kakao SDK를 사용한 카카오톡 공유
 */

import type { ShareCardSize, KakaoShareTemplateData } from '@/types/share'
import { SHARE_CARD_DIMENSIONS } from '@/types/share'

// =============================================================================
// 타입 정의
// =============================================================================

interface ImageCaptureOptions {
  element: HTMLElement
  size: ShareCardSize
  filename?: string
  quality?: number
  backgroundColor?: string
}

// Kakao SDK 타입 (전역 객체)
declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean
      init: (appKey: string) => void
      Share: {
        sendDefault: (options: KakaoShareOptions) => void
        createDefaultButton: (options: KakaoButtonOptions) => void
      }
    }
  }
}

interface KakaoShareOptions {
  objectType: 'feed'
  content: {
    title: string
    description: string
    imageUrl: string
    link: {
      mobileWebUrl: string
      webUrl: string
    }
  }
  buttons?: Array<{
    title: string
    link: {
      mobileWebUrl: string
      webUrl: string
    }
  }>
}

interface KakaoButtonOptions {
  container: string | HTMLElement
  objectType: 'feed'
  content: {
    title: string
    description: string
    imageUrl: string
    link: {
      mobileWebUrl: string
      webUrl: string
    }
  }
}

// =============================================================================
// 이미지 캡처 함수
// =============================================================================

/**
 * HTML 요소를 PNG 이미지로 캡처합니다.
 * html-to-image 라이브러리 사용
 */
export async function captureElementAsImage(
  options: ImageCaptureOptions
): Promise<Blob | null> {
  const { element, size, quality = 1, backgroundColor = '#ffffff' } = options
  const dimensions = SHARE_CARD_DIMENSIONS[size]

  try {
    // 동적 임포트 (클라이언트에서만 로드)
    const { toPng, toBlob } = await import('html-to-image')

    // 원본 스타일 저장
    const originalWidth = element.style.width
    const originalHeight = element.style.height
    const originalTransform = element.style.transform

    // 원본 크기로 설정 (캡처용)
    element.style.width = `${dimensions.width}px`
    element.style.height = `${dimensions.height}px`
    element.style.transform = 'scale(1)'

    // 이미지 캡처
    const blob = await toBlob(element, {
      width: dimensions.width,
      height: dimensions.height,
      pixelRatio: quality,
      backgroundColor,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
      },
      // 폰트 및 이미지 로딩 대기
      skipFonts: false,
      cacheBust: true,
    })

    // 원본 스타일 복원
    element.style.width = originalWidth
    element.style.height = originalHeight
    element.style.transform = originalTransform

    return blob
  } catch (error) {
    console.error('Failed to capture element:', error)
    return null
  }
}

/**
 * HTML 요소를 Data URL로 캡처합니다.
 */
export async function captureElementAsDataUrl(
  element: HTMLElement,
  size: ShareCardSize,
  quality: number = 1
): Promise<string | null> {
  const dimensions = SHARE_CARD_DIMENSIONS[size]

  try {
    const { toPng } = await import('html-to-image')

    // 원본 스타일 저장
    const originalWidth = element.style.width
    const originalHeight = element.style.height

    // 원본 크기로 설정 (캡처용)
    element.style.width = `${dimensions.width}px`
    element.style.height = `${dimensions.height}px`

    const dataUrl = await toPng(element, {
      width: dimensions.width,
      height: dimensions.height,
      pixelRatio: quality,
      backgroundColor: '#ffffff',
      skipFonts: false,
      cacheBust: true,
    })

    // 원본 스타일 복원
    element.style.width = originalWidth
    element.style.height = originalHeight

    return dataUrl
  } catch (error) {
    console.error('Failed to capture element as data URL:', error)
    return null
  }
}

// =============================================================================
// 이미지 다운로드 함수
// =============================================================================

/**
 * Blob을 파일로 다운로드합니다.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * HTML 요소를 캡처하여 PNG로 다운로드합니다.
 */
export async function downloadElementAsImage(
  element: HTMLElement,
  size: ShareCardSize,
  filename?: string
): Promise<boolean> {
  const blob = await captureElementAsImage({
    element,
    size,
    quality: 2, // 2x 해상도
  })

  if (!blob) {
    return false
  }

  const finalFilename = filename ?? `pixelo-space-${Date.now()}.png`
  downloadBlob(blob, finalFilename)
  return true
}

// =============================================================================
// 카카오 SDK 함수
// =============================================================================

/**
 * Kakao SDK를 초기화합니다.
 */
export function initKakaoSdk(): boolean {
  if (typeof window === 'undefined') return false

  const appKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY

  if (!appKey) {
    console.warn('Kakao App Key is not set')
    return false
  }

  if (!window.Kakao) {
    console.warn('Kakao SDK is not loaded')
    return false
  }

  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(appKey)
  }

  return window.Kakao.isInitialized()
}

/**
 * Kakao SDK 로드 여부를 확인합니다.
 */
export function isKakaoSdkReady(): boolean {
  return typeof window !== 'undefined' && !!window.Kakao?.isInitialized()
}

/**
 * 카카오톡으로 공유합니다.
 */
export async function shareToKakao(data: KakaoShareTemplateData): Promise<boolean> {
  if (!initKakaoSdk()) {
    console.error('Kakao SDK initialization failed')
    return false
  }

  try {
    window.Kakao?.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        link: {
          mobileWebUrl: data.linkUrl,
          webUrl: data.linkUrl,
        },
      },
      buttons: data.buttonTitle
        ? [
            {
              title: data.buttonTitle,
              link: {
                mobileWebUrl: data.linkUrl,
                webUrl: data.linkUrl,
              },
            },
          ]
        : undefined,
    })

    return true
  } catch (error) {
    console.error('Kakao share failed:', error)
    return false
  }
}

// =============================================================================
// 네이티브 공유 API
// =============================================================================

/**
 * Web Share API 지원 여부를 확인합니다.
 */
export function canUseNativeShare(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.share
}

/**
 * Web Share API를 사용하여 공유합니다.
 */
export async function nativeShare(data: {
  title: string
  text?: string
  url: string
  files?: File[]
}): Promise<boolean> {
  if (!canUseNativeShare()) {
    return false
  }

  try {
    await navigator.share(data)
    return true
  } catch (error) {
    // 사용자가 공유 취소한 경우
    if (error instanceof Error && error.name === 'AbortError') {
      return false
    }
    console.error('Native share failed:', error)
    return false
  }
}

/**
 * 이미지 파일과 함께 네이티브 공유합니다.
 */
export async function nativeShareWithImage(
  element: HTMLElement,
  size: ShareCardSize,
  shareData: { title: string; text: string; url: string }
): Promise<boolean> {
  if (!canUseNativeShare()) {
    return false
  }

  // 파일 공유 지원 여부 확인
  if (!navigator.canShare?.({ files: [new File([], '')] })) {
    return nativeShare(shareData)
  }

  const blob = await captureElementAsImage({ element, size })
  if (!blob) {
    return nativeShare(shareData)
  }

  const file = new File([blob], 'pixelo-space.png', { type: 'image/png' })

  return nativeShare({
    ...shareData,
    files: [file],
  })
}

// =============================================================================
// URL 생성 함수
// =============================================================================

/**
 * 공유 URL을 생성합니다.
 */
export function generateShareUrl(
  userId: string,
  seasonId?: string,
  baseUrl?: string
): string {
  const base = baseUrl ?? process.env.NEXT_PUBLIC_APP_URL ?? 'https://pixelo.app'
  const params = new URLSearchParams({ user: userId })

  if (seasonId) {
    params.set('season', seasonId)
  }

  return `${base}/share?${params.toString()}`
}

/**
 * 현재 페이지의 OG 이미지 URL을 생성합니다.
 */
export function generateOgImageUrl(userId: string, seasonId?: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://pixelo.app'
  const params = new URLSearchParams({ userId })

  if (seasonId) {
    params.set('seasonId', seasonId)
  }

  return `${base}/api/og?${params.toString()}`
}
