import type { Tool } from '../types'

export interface ToolRegistry {
  [key: string]: Tool
}

export interface ToolGroup {
  category: string
  tools: Tool[]
}

export interface ToolFilter {
  category?: string
  query?: string
}

export interface Registry {
  register(conversion: Tool): void
  unregister(id: string): void
  get(id: string): Tool | undefined
  getAll(): Tool[]
  getByCategory(category: string): Tool[]
  search(filter: ToolFilter): Tool[]
  getGroups(): ToolGroup[]
}
