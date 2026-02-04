'use client'

import { useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useQuestionStore } from '@/stores'
import type { Answer } from '@/types'

/**
 * 질문/답변 관리 훅
 */
export function useQuestion() {
  const {
    todayQuestion,
    todayAnswer,
    isLoading,
    isSaving,
    setTodayQuestion,
    setTodayAnswer,
    setLoading,
    setSaving,
  } = useQuestionStore()
  const supabase = createClient()

  /**
   * 오늘의 질문 가져오기
   */
  const fetchTodayQuestion = useCallback(async () => {
    setLoading(true)
    try {
      // TODO: 실제 API 구현 후 수정
      // const { data, error } = await supabase
      //   .from('questions')
      //   .select('*')
      //   .eq('date', today)
      //   .single()

      // 임시 목 데이터
      setTodayQuestion({
        id: '1',
        content: '당신이 가장 행복했던 순간은 언제인가요?',
        category: 'emotion',
        seasonId: '1',
        order: 1,
        createdAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Failed to fetch question:', error)
    } finally {
      setLoading(false)
    }
  }, [setLoading, setTodayQuestion])

  /**
   * 답변 저장하기
   */
  const saveAnswer = useCallback(
    async (content: string, colorCode: string): Promise<Answer | null> => {
      if (!todayQuestion) return null

      setSaving(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not authenticated')

        // TODO: 실제 API 구현 후 수정
        // const { data, error } = await supabase
        //   .from('answers')
        //   .insert({
        //     user_id: user.id,
        //     question_id: todayQuestion.id,
        //     content,
        //     color_code: colorCode,
        //   })
        //   .select()
        //   .single()

        // 임시 목 데이터
        const answer: Answer = {
          id: Date.now().toString(),
          userId: user.id,
          questionId: todayQuestion.id,
          content,
          colorCode,
          createdAt: new Date().toISOString(),
        }

        setTodayAnswer(answer)
        return answer
      } catch (error) {
        console.error('Failed to save answer:', error)
        return null
      } finally {
        setSaving(false)
      }
    },
    [todayQuestion, supabase.auth, setTodayAnswer, setSaving]
  )

  return {
    todayQuestion,
    todayAnswer,
    isLoading,
    isSaving,
    hasAnswered: !!todayAnswer,
    fetchTodayQuestion,
    saveAnswer,
  }
}
