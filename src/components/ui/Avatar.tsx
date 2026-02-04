import { cn } from '@/lib/utils'
import Image from 'next/image'

interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  size?: 'sm' | 'default' | 'lg' | 'xl'
  className?: string
}

export function Avatar({
  src,
  alt = 'Avatar',
  fallback,
  size = 'default',
  className,
}: AvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    default: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  }

  const getFallbackText = () => {
    if (fallback) {
      return fallback.slice(0, 2).toUpperCase()
    }
    if (alt && alt !== 'Avatar') {
      return alt.slice(0, 2).toUpperCase()
    }
    return '?'
  }

  if (src) {
    return (
      <div
        className={cn(
          'relative shrink-0 overflow-hidden rounded-full',
          sizeClasses[size],
          className
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={size === 'xl' ? '64px' : size === 'lg' ? '48px' : size === 'sm' ? '32px' : '40px'}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground',
        sizeClasses[size],
        className
      )}
      aria-label={alt}
    >
      {getFallbackText()}
    </div>
  )
}
