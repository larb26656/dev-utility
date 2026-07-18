import { describe, expect, it } from 'vitest'
import { uuidTool } from './uuid'

describe('UUID', () => {
  it('generates UUID v4', async () => {
    const result = await uuidTool.generate()
    expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  })

  it('generates different UUIDs on multiple calls', async () => {
    const result1 = await uuidTool.generate()
    const result2 = await uuidTool.generate()
    expect(result1).not.toBe(result2)
  })

  it('generates 36 character string', async () => {
    const result = await uuidTool.generate()
    expect(result.length).toBe(36)
  })

  it('generates lowercase hex characters', async () => {
    const result = await uuidTool.generate()
    expect(result).toMatch(/^[0-9a-f-]+$/)
  })

  it('has correct UUID v4 version (4) and variant (8, 9, a, or b)', async () => {
    const result = await uuidTool.generate()
    const version = result[14]
    expect(version).toBe('4')
    const variant = result[19]
    expect(['8', '9', 'a', 'b']).toContain(variant)
  })
})
