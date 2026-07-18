import { describe, expect, it } from 'vitest'
import { timestampTool } from './timestamp'

describe('Timestamp', () => {
  it('has correct tool metadata', () => {
    expect(timestampTool.id).toBe('timestamp')
    expect(timestampTool.name).toBe('Timestamp')
    expect(timestampTool.category).toBe('Converter')
  })

  it('is a freestyle tool type', () => {
    expect(timestampTool.type).toBe('freestyle')
  })

  it('has a component defined', () => {
    expect(timestampTool.component).toBeDefined()
    expect(typeof timestampTool.component).toBe('function')
  })

  it('has description', () => {
    expect(timestampTool.description).toBeTruthy()
    expect(timestampTool.description?.length).toBeGreaterThan(0)
  })
})
