export default function QuestionPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-lg space-y-8 text-center">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">오늘의 질문</p>
          <h1 className="text-2xl font-medium">
            당신이 가장 행복했던 순간은 언제인가요?
          </h1>
        </div>

        <div className="space-y-4">
          <textarea
            placeholder="오늘의 답변을 적어주세요..."
            className="min-h-[200px] w-full resize-none rounded-lg border bg-background p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            답변 저장하기
          </button>
        </div>
      </div>
    </div>
  )
}
