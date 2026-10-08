import { describe, expect, it } from 'vitest'
import { textSizeTool } from './text-size'

describe('Text Size Tool', () => {
  it('has correct tool metadata', () => {
    expect(textSizeTool.id).toBe('text-size')
    expect(textSizeTool.name).toBe('Text Size')
    expect(textSizeTool.category).toBe('Typo')
  })

  it('is a freestyle tool type', () => {
    expect(textSizeTool.type).toBe('freestyle')
  })

  it('has a component defined', () => {
    expect(textSizeTool.component).toBeDefined()
    expect(typeof textSizeTool.component).toBe('function')
  })

  it('has a non-trivial description', () => {
    expect(textSizeTool.description).toBeTruthy()
    expect(textSizeTool.description?.length ?? 0).toBeGreaterThan(20)
  })
})
