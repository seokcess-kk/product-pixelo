interface ErrorMessageProps {
  title?: string
  message: string
  retry?: () => void
}

export function ErrorMessage({
  title = '오류가 발생했습니다',
  message,
  retry,
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h3 className="mb-2 text-lg font-medium text-destructive">{title}</h3>
      <p className="mb-4 text-muted-foreground">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="rounded-lg border border-input px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          다시 시도
        </button>
      )}
    </div>
  )
}
