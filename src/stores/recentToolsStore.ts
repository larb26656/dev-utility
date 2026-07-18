import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface RecentTool {
  id: string
  name: string
  category: string
  usedAt: number
}

interface RecentToolsStore {
  recentTools: Array<RecentTool>
  isRecentCollapsed: boolean
  addRecentTool: (tool: { id: string; name: string; category: string }) => void
  removeRecentTool: (id: string) => void
  clearRecent: () => void
  toggleRecentCollapsed: () => void
}

export const useRecentToolsStore = create<RecentToolsStore>()(
  persist(
    (set) => ({
      recentTools: [],
      isRecentCollapsed: false,
      addRecentTool: (tool) =>
        set((state) => {
          const filtered = state.recentTools.filter((t) => t.id !== tool.id)
          const updated = [{ ...tool, usedAt: Date.now() }, ...filtered].slice(0, 5)
          return { recentTools: updated, isRecentCollapsed: false }
        }),
      removeRecentTool: (id) =>
        set((state) => ({
          recentTools: state.recentTools.filter((t) => t.id !== id),
        })),
      clearRecent: () => set({ recentTools: [] }),
      toggleRecentCollapsed: () =>
        set((state) => ({ isRecentCollapsed: !state.isRecentCollapsed })),
    }),
    { name: 'recent-tools' }
  )
)
