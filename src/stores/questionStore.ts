import { create } from 'zustand'
import type { Question, Answer } from '@/types'

interface QuestionState {
  todayQuestion: Question | null
  todayAnswer: Answer | null
  isLoading: boolean
  isSaving: boolean

  // Actions
  setTodayQuestion: (question: Question | null) => void
  setTodayAnswer: (answer: Answer | null) => void
  setLoading: (isLoading: boolean) => void
  setSaving: (isSaving: boolean) => void
  reset: () => void
}

const initialState = {
  todayQuestion: null,
  todayAnswer: null,
  isLoading: true,
  isSaving: false,
}

export const useQuestionStore = create<QuestionState>((set) => ({
  ...initialState,

  setTodayQuestion: (todayQuestion) => set({ todayQuestion }),
  setTodayAnswer: (todayAnswer) => set({ todayAnswer }),
  setLoading: (isLoading) => set({ isLoading }),
  setSaving: (isSaving) => set({ isSaving }),
  reset: () => set(initialState),
}))
