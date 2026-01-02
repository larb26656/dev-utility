import type { Tool } from '../types'
import type { ToolFilter, ToolGroup, Registry } from './types'

export class ToolRegistryImpl implements Registry {
  private tools: Map<string, Tool> = new Map()

  register(tool: Tool): void {
    this.tools.set(tool.id, tool)
  }

  unregister(id: string): void {
    this.tools.delete(id)
  }

  get(id: string): Tool | undefined {
    return this.tools.get(id)
  }

  getAll(): Tool[] {
    return Array.from(this.tools.values())
  }

  getByCategory(category: string): Tool[] {
    return this.getAll().filter((c) => c.category === category)
  }

  // search(filter: ConversionFilter): Conversion[] {
  //   let results = this.getAll()

  //   if (filter.category) {
  //     results = results.filter((c) => c.category === filter.category)
  //   }

  //   if (filter.query) {
  //     const query = filter.query.toLowerCase()
  //     results = results.filter(
  //       (c) =>
  //         c.name.toLowerCase().includes(query) ||
  //         c.description.toLowerCase().includes(query) ||
  //         c.inputFormat.toLowerCase().includes(query) ||
  //         c.outputFormat.toLowerCase().includes(query),
  //     )
  //   }

  //   return results
  // }

  search(filter: ToolFilter): Tool[] {
    throw new Error('Method not implemented.')
  }

  getGroups(): ToolGroup[] {
    const categoryMap = new Map<string, Tool[]>()

    this.getAll().forEach((conversion) => {
      const group = categoryMap.get(conversion.category) || []
      group.push(conversion)
      categoryMap.set(conversion.category, group)
    })

    return Array.from(categoryMap.entries()).map(([category, tools]) => ({
      category,
      tools,
    }))
  }
}

export const registry = new ToolRegistryImpl()
