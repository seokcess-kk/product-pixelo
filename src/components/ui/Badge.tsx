import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive'
  size?: 'sm' | 'default'
  className?: string
}

export function Badge({
  children,
  variant = 'default',
  size = 'default',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        // Variants
        {
          'bg-primary text-primary-foreground': variant === 'default',
          'bg-secondary text-secondary-foreground': variant === 'secondary',
          'border border-input bg-background': variant === 'outline',
          'bg-success-light text-success-dark': variant === 'success',
          'bg-warning-light text-warning-dark': variant === 'warning',
          'bg-destructive text-destructive-foreground': variant === 'destructive',
        },
        // Sizes
        {
          'px-2 py-0.5 text-xs': size === 'sm',
          'px-2.5 py-0.5 text-sm': size === 'default',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
