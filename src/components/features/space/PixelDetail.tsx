import type { Pixel } from '@/types'

interface PixelDetailProps {
  pixel: Pixel
  onClose: () => void
}

export function PixelDetail({ pixel, onClose }: PixelDetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">픽셀 상세</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="닫기"
          >
            X
          </button>
        </div>

        <div className="space-y-4">
          <div
            className="mx-auto h-20 w-20 rounded-lg"
            style={{ backgroundColor: pixel.colorCode }}
          />
          <div className="text-center text-sm text-muted-foreground">
            위치: ({pixel.x}, {pixel.y})
          </div>
          <div className="text-center text-sm text-muted-foreground">
            생성일: {new Date(pixel.createdAt || '').toLocaleDateString('ko-KR')}
          </div>
        </div>
      </div>
    </div>
  )
}
