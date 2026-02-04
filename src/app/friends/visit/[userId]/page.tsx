interface VisitPageProps {
  params: Promise<{
    userId: string
  }>
}

export default async function VisitPage({ params }: VisitPageProps) {
  const { userId } = await params

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">친구의 공간</h1>
          <p className="text-muted-foreground">
            친구의 픽셀 공간을 구경해보세요
          </p>
        </div>

        {/* Friend's Space */}
        <div className="aspect-square w-full rounded-lg border bg-muted/30">
          <div className="flex h-full items-center justify-center text-muted-foreground">
            친구 픽셀 공간 (ID: {userId})
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            비교하기
          </button>
          <button className="rounded-lg border px-6 py-3 font-medium transition-colors hover:bg-muted">
            반응 남기기
          </button>
        </div>
      </div>
    </div>
  )
}
