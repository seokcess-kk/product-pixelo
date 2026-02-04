import type { Pixel, Season } from '@/types'

interface SharePreviewProps {
  season: Season
  pixels: Pixel[]
}

export function SharePreview({ season, pixels }: SharePreviewProps) {
  return (
    <div className="aspect-square w-full rounded-lg border bg-card p-4">
      <div className="flex h-full flex-col items-center justify-center space-y-4">
        <h3 className="text-lg font-medium">{season.name}</h3>
        <div className="text-sm text-muted-foreground">
          {pixels.length}개의 픽셀
        </div>
        {/* TODO: 실제 픽셀 그리드 렌더링 */}
        <div className="text-muted-foreground">공유 이미지 미리보기</div>
      </div>
    </div>
  )
}
