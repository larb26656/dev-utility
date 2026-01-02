import type { Tool } from '../types'

export interface ToolRegistry {
  [key: string]: Tool
}

export interface ToolGroup {
  category: string
  tools: Array<Tool>
}

export interface ToolFilter {
  category?: string
  query?: string
}

export interface Registry {
  register: (conversion: Tool) => void
  unregister: (id: string) => void
  get: (id: string) => Tool | undefined
  getAll: () => Array<Tool>
  getByCategory: (category: string) => Array<Tool>
  search: (filter: ToolFilter) => Array<Tool>
  getGroups: () => Array<ToolGroup>
}
