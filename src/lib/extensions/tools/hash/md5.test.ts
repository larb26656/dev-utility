import { describe, expect, it } from 'vitest'
import { md5Tool } from './md5'

const { convert } = md5Tool

describe('MD5', () => {
  it('generates MD5 hash from input', () => {
    const result = convert('hello')
    expect(result).toBe('5d41402abc4b2a76b9719d911017c592')
  })

  it('generates consistent hash for same input', () => {
    const input = 'test'
    const result1 = convert(input)
    const result2 = convert(input)
    expect(result1).toBe(result2)
  })

  it('produces 32 character hex string', () => {
    const result = convert('hello world')
    expect(result).toMatch(/^[a-f0-9]{32}$/)
  })

  it('handles empty string', () => {
    const result = convert('')
    expect(result).toBe('d41d8cd98f00b204e9800998ecf8427e')
  })

  it('handles unicode characters', () => {
    const result = convert('สวัสดี')
    expect(result).toMatch(/^[a-f0-9]{32}$/)
  })

  it('produces different hashes for different inputs', () => {
    const result1 = convert('hello')
    const result2 = convert('world')
    expect(result1).not.toBe(result2)
  })
})
