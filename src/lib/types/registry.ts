import type { Conversion } from './core'

export interface ConversionRegistry {
  [key: string]: Conversion
}

export interface ConversionGroup {
  category: string
  conversions: Conversion[]
}

export interface ConversionFilter {
  category?: string
  query?: string
}

export interface Registry {
  register(conversion: Conversion): void
  unregister(id: string): void
  get(id: string): Conversion | undefined
  getAll(): Conversion[]
  getByCategory(category: string): Conversion[]
  search(filter: ConversionFilter): Conversion[]
  getGroups(): ConversionGroup[]
}
