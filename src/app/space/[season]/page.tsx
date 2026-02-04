interface SpacePageProps {
  params: Promise<{
    season: string
  }>
}

export default async function SpacePage({ params }: SpacePageProps) {
  const { season } = await params

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">나의 공간</h1>
          <p className="mt-2 text-muted-foreground">
            {season} 시즌
          </p>
        </div>

        {/* Pixel Grid Placeholder */}
        <div className="aspect-square w-full rounded-lg border bg-muted/30 p-4">
          <div className="flex h-full items-center justify-center text-muted-foreground">
            픽셀 공간이 여기에 표시됩니다
          </div>
        </div>
      </div>
    </div>
  )
}
