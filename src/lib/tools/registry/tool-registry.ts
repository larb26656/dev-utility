import Fuse from 'fuse.js'

import { buildSearchIndex } from '../search/index-builder'
import { CATEGORY_ORDER } from '../types'
import type { Tool } from '../types'
import type { Registry, ToolFilter, ToolGroup } from './types'
import type { SearchResultItem } from '../search/types'

export class ToolRegistryImpl implements Registry {
  private tools: Map<string, Tool> = new Map()
  private fuse: Fuse<SearchResultItem> | null = null

  register(tool: Tool): void {
    this.tools.set(tool.id, tool)
    this.fuse = null
  }

  unregister(id: string): void {
    this.tools.delete(id)
    this.fuse = null
  }

  get(id: string): Tool | undefined {
    return this.tools.get(id)
  }

  getAll(): Array<Tool> {
    return Array.from(this.tools.values())
  }

  getByCategory(category: string): Array<Tool> {
    return this.getAll().filter((c) => c.category === category)
  }

  search(filter: ToolFilter): Array<Tool> {
    const results = this.getAll()

    let filtered = results

    if (filter.category) {
      filtered = filtered.filter((c) => c.category === filter.category)
    }

    if (filter.query) {
      const query = filter.query.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.description?.toLowerCase().includes(query),
      )
    }

    return filtered
  }

  fuzzySearch(query: string): Array<SearchResultItem> {
    if (!this.fuse) {
      const index = buildSearchIndex(this.getAll())
      this.fuse = new Fuse(index, {
        keys: [
          { name: 'name', weight: 0.4 },
          { name: 'description', weight: 0.3 },
          { name: 'category', weight: 0.2 },
          { name: 'key', weight: 0.4 },
          { name: 'value', weight: 0.3 },
          { name: 'toolName', weight: 0.2 },
          { name: 'keywords', weight: 0.25 },
        ],
        threshold: 0.4,
        includeScore: true,
      })
    }

    const results = this.fuse.search(query)
    return results.map((r) => r.item)
  }

  getGroups(): Array<ToolGroup> {
    const categoryMap = new Map<string, Array<Tool>>()

    this.getAll().forEach((conversion) => {
      const group = categoryMap.get(conversion.category) || []
      group.push(conversion)
      categoryMap.set(conversion.category, group)
    })

    const toGroup = ([category, tools]: [string, Array<Tool>]): ToolGroup => ({
      category,
      tools: [...tools].sort((a, b) => a.name.localeCompare(b.name)),
    })

    const ordered: Array<ToolGroup> = []
    const seen = new Set<string>()

    for (const category of CATEGORY_ORDER) {
      const tools = categoryMap.get(category)
      if (tools) {
        ordered.push(toGroup([category, tools]))
        seen.add(category)
      }
    }

    for (const [category, tools] of categoryMap) {
      if (!seen.has(category)) {
        ordered.push(toGroup([category, tools]))
      }
    }

    return ordered
  }
}

export const registry = new ToolRegistryImpl()
