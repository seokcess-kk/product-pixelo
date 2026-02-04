import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          PIXELO
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          매일 답하는 질문으로 완성되는 나만의 픽셀 공간
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-lg bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            시작하기
          </Link>
        </div>
      </div>
    </div>
  )
}
