export default function SharePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-lg space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">공간 공유하기</h1>
          <p className="text-muted-foreground">
            나만의 픽셀 공간을 친구들과 공유해보세요
          </p>
        </div>

        {/* Preview Placeholder */}
        <div className="aspect-square w-full rounded-lg border bg-muted/30">
          <div className="flex h-full items-center justify-center text-muted-foreground">
            공유 이미지 미리보기
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            이미지 저장하기
          </button>
          <button className="rounded-lg border px-6 py-3 font-medium transition-colors hover:bg-muted">
            링크 복사하기
          </button>
        </div>
      </div>
    </div>
  )
}
