import { create } from 'zustand'
import type { Season, Pixel } from '@/types'

interface SpaceState {
  currentSeason: Season | null
  pixels: Pixel[]
  isLoading: boolean
  selectedPixel: Pixel | null

  // Actions
  setSeason: (season: Season | null) => void
  setPixels: (pixels: Pixel[]) => void
  addPixel: (pixel: Pixel) => void
  setLoading: (isLoading: boolean) => void
  selectPixel: (pixel: Pixel | null) => void
  reset: () => void
}

const initialState = {
  currentSeason: null,
  pixels: [],
  isLoading: true,
  selectedPixel: null,
}

export const useSpaceStore = create<SpaceState>((set) => ({
  ...initialState,

  setSeason: (currentSeason) => set({ currentSeason }),
  setPixels: (pixels) => set({ pixels }),
  addPixel: (pixel) =>
    set((state) => ({
      pixels: [...state.pixels, pixel],
    })),
  setLoading: (isLoading) => set({ isLoading }),
  selectPixel: (selectedPixel) => set({ selectedPixel }),
  reset: () => set(initialState),
}))
