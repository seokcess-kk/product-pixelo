'use client'

import { useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSpaceStore } from '@/stores'
import type { Pixel } from '@/types'

/**
 * 공간(픽셀 그리드) 관리 훅
 */
export function useSpace(seasonId?: string) {
  const {
    currentSeason,
    pixels,
    isLoading,
    selectedPixel,
    setSeason,
    setPixels,
    addPixel,
    setLoading,
    selectPixel,
  } = useSpaceStore()
  const supabase = createClient()

  /**
   * 시즌 정보와 픽셀 데이터 가져오기
   */
  const fetchSpace = useCallback(
    async (targetSeasonId?: string) => {
      const id = targetSeasonId || seasonId
      if (!id) return

      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not authenticated')

        // TODO: 실제 API 구현 후 수정
        // const { data: season } = await supabase
        //   .from('seasons')
        //   .select('*')
        //   .eq('id', id)
        //   .single()

        // const { data: pixels } = await supabase
        //   .from('pixels')
        //   .select('*')
        //   .eq('user_id', user.id)
        //   .eq('season_id', id)

        // 임시 목 데이터
        setSeason({
          id: id,
          name: '2024 봄',
          startDate: '2024-03-01',
          endDate: '2024-05-31',
          gridSize: 10,
          isActive: true,
        })

        setPixels([])
      } catch (error) {
        console.error('Failed to fetch space:', error)
      } finally {
        setLoading(false)
      }
    },
    [seasonId, supabase.auth, setSeason, setPixels, setLoading]
  )

  /**
   * 친구의 공간 가져오기
   */
  const fetchFriendSpace = useCallback(
    async (friendId: string, targetSeasonId?: string): Promise<Pixel[]> => {
      const id = targetSeasonId || seasonId
      if (!id) return []

      try {
        // TODO: 실제 API 구현 후 수정
        // const { data: pixels } = await supabase
        //   .from('pixels')
        //   .select('*')
        //   .eq('user_id', friendId)
        //   .eq('season_id', id)

        return []
      } catch (error) {
        console.error('Failed to fetch friend space:', error)
        return []
      }
    },
    [seasonId]
  )

  return {
    currentSeason,
    pixels,
    isLoading,
    selectedPixel,
    fetchSpace,
    fetchFriendSpace,
    selectPixel,
    addPixel,
  }
}
