import { beforeEach, describe, expect, it } from 'vitest'
import { ToolRegistryImpl } from './tool-registry'
import { createGeneratorTool } from '@/lib/tools/generator'

const makeTool = (id: string, name: string, category: string) =>
  createGeneratorTool({
    id,
    name,
    category: category as never,
    generate: () => '',
  })

describe('ToolRegistryImpl.getGroups', () => {
  let registry: ToolRegistryImpl

  beforeEach(() => {
    registry = new ToolRegistryImpl()
  })

  it('returns empty array when no tools are registered', () => {
    expect(registry.getGroups()).toEqual([])
  })

  it('orders groups by CATEGORY_ORDER (Hash, Typo, Network, Converter, Snippet)', () => {
    registry.register(makeTool('a', 'A', 'Snippet'))
    registry.register(makeTool('b', 'B', 'Converter'))
    registry.register(makeTool('c', 'C', 'Network'))
    registry.register(makeTool('d', 'D', 'Typo'))
    registry.register(makeTool('e', 'E', 'Hash'))

    const groups = registry.getGroups()
    expect(groups.map((g) => g.category)).toEqual([
      'Hash',
      'Typo',
      'Network',
      'Converter',
      'Snippet',
    ])
  })

  it('sorts tools within each group alphabetically by name', () => {
    registry.register(makeTool('z', 'Zebra', 'Hash'))
    registry.register(makeTool('a', 'Apple', 'Hash'))
    registry.register(makeTool('m', 'Mango', 'Hash'))

    const groups = registry.getGroups()
    expect(groups[0]?.tools.map((t) => t.name)).toEqual([
      'Apple',
      'Mango',
      'Zebra',
    ])
  })

  it('does not mutate the underlying tools array', () => {
    registry.register(makeTool('z', 'Zebra', 'Hash'))
    registry.register(makeTool('a', 'Apple', 'Hash'))

    const before = registry.getByCategory('Hash').map((t) => t.name)
    registry.getGroups()
    const after = registry.getByCategory('Hash').map((t) => t.name)

    expect(after).toEqual(before)
  })

  it('appends unknown categories at the end in registration order', () => {
    registry.register(makeTool('a', 'A', 'Hash'))
    registry.register(makeTool('b', 'B', 'Zeta'))
    registry.register(makeTool('c', 'C', 'Alpha'))

    const groups = registry.getGroups()
    expect(groups.map((g) => g.category)).toEqual([
      'Hash',
      'Zeta',
      'Alpha',
    ])
  })

  it('keeps tools grouped under their category', () => {
    registry.register(makeTool('b', 'Beta', 'Converter'))
    registry.register(makeTool('a', 'Alpha', 'Hash'))

    const groups = registry.getGroups()
    expect(groups[0]?.category).toBe('Hash')
    expect(groups[0]?.tools.map((t) => t.name)).toEqual(['Alpha'])
    expect(groups[1]?.category).toBe('Converter')
    expect(groups[1]?.tools.map((t) => t.name)).toEqual(['Beta'])
  })
})
