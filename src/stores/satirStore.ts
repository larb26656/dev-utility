import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SatirLevel =
  | 'behavior'
  | 'coping'
  | 'feelings'
  | 'perceptions'
  | 'yearning'

export interface SatirLevels {
  behavior: string
  coping: string
  feelings: string
  perceptions: string
  yearning: string
}

interface SatirStore {
  scenario: string
  levels: SatirLevels
  setScenario: (value: string) => void
  setLevel: (level: SatirLevel, value: string) => void
  reset: () => void
}

const EMPTY_LEVELS: SatirLevels = {
  behavior: '',
  coping: '',
  feelings: '',
  perceptions: '',
  yearning: '',
}

export const useSatirStore = create<SatirStore>()(
  persist(
    (set) => ({
      scenario: '',
      levels: EMPTY_LEVELS,
      setScenario: (value) => set({ scenario: value }),
      setLevel: (level, value) =>
        set((state) => ({
          levels: { ...state.levels, [level]: value },
        })),
      reset: () => set({ scenario: '', levels: EMPTY_LEVELS }),
    }),
    { name: 'satir-state' },
  ),
)