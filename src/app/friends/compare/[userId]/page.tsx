interface ComparePageProps {
  params: Promise<{
    userId: string
  }>
}

export default async function ComparePage({ params }: ComparePageProps) {
  const { userId } = await params

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">공간 비교하기</h1>
          <p className="text-muted-foreground">
            친구와 나의 픽셀 공간을 비교해보세요
          </p>
        </div>

        {/* Compare Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* My Space */}
          <div className="space-y-4">
            <h2 className="text-center font-medium">나의 공간</h2>
            <div className="aspect-square rounded-lg border bg-muted/30">
              <div className="flex h-full items-center justify-center text-muted-foreground">
                내 픽셀 공간
              </div>
            </div>
          </div>

          {/* Friend's Space */}
          <div className="space-y-4">
            <h2 className="text-center font-medium">친구의 공간</h2>
            <div className="aspect-square rounded-lg border bg-muted/30">
              <div className="flex h-full items-center justify-center text-muted-foreground">
                친구 픽셀 공간 (ID: {userId})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
