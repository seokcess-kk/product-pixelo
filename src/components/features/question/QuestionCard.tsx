import type { Question } from '@/types'

interface QuestionCardProps {
  question: Question
}

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <div className="space-y-4 rounded-lg border bg-card p-6 text-center">
      <p className="text-sm text-muted-foreground">오늘의 질문</p>
      <h2 className="text-xl font-medium text-foreground">{question.content}</h2>
    </div>
  )
}
