import type {
  Registry,
  Conversion,
  ConversionFilter,
  ConversionGroup,
} from './types'

export class ConversionRegistry implements Registry {
  private conversions: Map<string, Conversion> = new Map()

  register(conversion: Conversion): void {
    this.conversions.set(conversion.id, conversion)
  }

  unregister(id: string): void {
    this.conversions.delete(id)
  }

  get(id: string): Conversion | undefined {
    return this.conversions.get(id)
  }

  getAll(): Conversion[] {
    return Array.from(this.conversions.values())
  }

  getByCategory(category: string): Conversion[] {
    return this.getAll().filter((c) => c.category === category)
  }

  search(filter: ConversionFilter): Conversion[] {
    let results = this.getAll()

    if (filter.category) {
      results = results.filter((c) => c.category === filter.category)
    }

    if (filter.query) {
      const query = filter.query.toLowerCase()
      results = results.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.inputFormat.toLowerCase().includes(query) ||
          c.outputFormat.toLowerCase().includes(query),
      )
    }

    return results
  }

  getGroups(): ConversionGroup[] {
    const categoryMap = new Map<string, Conversion[]>()

    this.getAll().forEach((conversion) => {
      const group = categoryMap.get(conversion.category) || []
      group.push(conversion)
      categoryMap.set(conversion.category, group)
    })

    return Array.from(categoryMap.entries()).map(([category, conversions]) => ({
      category,
      conversions,
    }))
  }
}

export const registry = new ConversionRegistry()
