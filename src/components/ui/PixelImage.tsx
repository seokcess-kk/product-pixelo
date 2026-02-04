'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const PLACEHOLDER_IMAGE = '/images/placeholder-object.svg'

interface PixelImageProps {
  src?: string | null
  alt: string
  className?: string
  fallback?: string
}

/**
 * 이미지 로드 실패 시 플레이스홀더를 표시하는 이미지 컴포넌트
 */
export function PixelImage({
  src,
  alt,
  className,
  fallback = PLACEHOLDER_IMAGE,
}: PixelImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallback)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(fallback)
    }
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={cn('pixel-render', className)}
      onError={handleError}
    />
  )
}
