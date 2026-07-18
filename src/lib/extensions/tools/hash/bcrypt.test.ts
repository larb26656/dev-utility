import { describe, expect, it } from 'vitest'
import { bcryptTool } from './bcrypt'

const { convert } = bcryptTool

describe('Bcrypt', () => {
  it('generates bcrypt hash from input', () => {
    const result = convert('password123')
    expect(result).toMatch(/^\$2[aby]?\$\d{1,2}\$[./A-Za-z0-9]{53}$/)
  })

  it('generates different hashes for same input (salted)', () => {
    const input = 'password123'
    const result1 = convert(input)
    const result2 = convert(input)
    expect(result1).not.toBe(result2)
  })

  it('produces valid bcrypt hash format', () => {
    const result = convert('test')
    expect(result).toMatch(/^\$2[aby]?\$/)
    expect(result.length).toBe(60)
  })

  it('handles empty string', () => {
    const result = convert('')
    expect(result).toMatch(/^\$2[aby]?\$\d{1,2}\$[./A-Za-z0-9]{53}$/)
  })

  it('handles unicode characters', () => {
    const result = convert('пароль')
    expect(result).toMatch(/^\$2[aby]?\$/)
    expect(result.length).toBe(60)
  })
})
