interface EmptyStateProps {
  title?: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {title && (
        <h3 className="mb-2 text-lg font-medium text-foreground">{title}</h3>
      )}
      <p className="mb-4 text-muted-foreground">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
