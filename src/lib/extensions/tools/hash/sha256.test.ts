import { describe, expect, it } from 'vitest'
import { sha256Tool } from './sha256'

const { convert } = sha256Tool

describe('SHA-256', () => {
  it('generates SHA-256 hash from input', () => {
    const result = convert('hello')
    expect(result).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')
  })

  it('generates consistent hash for same input', () => {
    const input = 'test'
    const result1 = convert(input)
    const result2 = convert(input)
    expect(result1).toBe(result2)
  })

  it('produces 64 character hex string', () => {
    const result = convert('hello world')
    expect(result).toMatch(/^[a-f0-9]{64}$/)
  })

  it('handles empty string', () => {
    const result = convert('')
    expect(result).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
  })

  it('handles unicode characters', () => {
    const result = convert('สวัสดี')
    expect(result).toMatch(/^[a-f0-9]{64}$/)
  })

  it('produces different hashes for different inputs', () => {
    const result1 = convert('hello')
    const result2 = convert('world')
    expect(result1).not.toBe(result2)
  })
})
