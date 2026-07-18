import { describe, expect, it } from 'vitest'
import { upperCaseTool } from './upper-case'

const { convert } = upperCaseTool

describe('Uppercase', () => {
  it('converts lowercase letters to uppercase', () => {
    expect(convert('hello')).toBe('HELLO')
  })

  it('handles mixed case input', () => {
    expect(convert('HeLLo WoRLD')).toBe('HELLO WORLD')
  })

  it('preserves non-letter characters', () => {
    expect(convert('hello123!')).toBe('HELLO123!')
  })

  it('handles empty string', () => {
    expect(convert('')).toBe('')
  })

  it('handles unicode characters', () => {
    expect(convert('สวัสดี')).toBe('สวัสดี')
  })

  it('handles already uppercase input', () => {
    expect(convert('HELLO')).toBe('HELLO')
  })

  it('handles single character', () => {
    expect(convert('a')).toBe('A')
  })
})
