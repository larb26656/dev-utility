import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoriteTool {
  id: string
  name: string
  category: string
}

interface FavoritesStore {
  favorites: Array<FavoriteTool>
  isFavoritesCollapsed: boolean
  toggleFavorite: (tool: { id: string; name: string; category: string }) => void
  isFavorite: (id: string) => boolean
  toggleFavoritesCollapsed: () => void
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      isFavoritesCollapsed: false,
      toggleFavorite: (tool) =>
        set((state) => {
          const exists = state.favorites.some((t) => t.id === tool.id)
          if (exists) {
            return { favorites: state.favorites.filter((t) => t.id !== tool.id) }
          }
          return { favorites: [...state.favorites, { ...tool }] }
        }),
      isFavorite: (id) => get().favorites.some((t) => t.id === id),
      toggleFavoritesCollapsed: () =>
        set((state) => ({ isFavoritesCollapsed: !state.isFavoritesCollapsed })),
    }),
    { name: 'favorites-tools' }
  )
)
