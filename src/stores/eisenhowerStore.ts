import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Quadrant = 'do' | 'schedule' | 'delegate' | 'eliminate'

export interface TaskItem {
  id: string
  text: string
  quadrant: Quadrant | null
}

interface EisenhowerStore {
  tasks: Array<TaskItem>
  addTasks: (texts: Array<string>) => void
  updateTask: (id: string, patch: Partial<Omit<TaskItem, 'id'>>) => void
  setQuadrant: (id: string, quadrant: Quadrant | null) => void
  removeTask: (id: string) => void
  reset: () => void
}

export const useEisenhowerStore = create<EisenhowerStore>()(
  persist(
    (set) => ({
      tasks: [],
      addTasks: (texts) =>
        set((state) => {
          const newTasks: Array<TaskItem> = texts.map((text) => ({
            id:
              typeof crypto !== 'undefined' && 'randomUUID' in crypto
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
            text,
            quadrant: null,
          }))
          return { tasks: [...state.tasks, ...newTasks] }
        }),
      updateTask: (id, patch) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),
      setQuadrant: (id, quadrant) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, quadrant } : t)),
        })),
      removeTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
      reset: () => set({ tasks: [] }),
    }),
    { name: 'eisenhower-state' },
  ),
)
