import { describe, expect, it } from 'vitest'
import { computeTextStats, formatSize, getUtf8Bytes } from './textSizeUtils'

describe('getUtf8Bytes', () => {
  it('returns 0 for empty string', () => {
    expect(getUtf8Bytes('')).toBe(0)
  })

  it('counts 1 byte per ASCII character', () => {
    expect(getUtf8Bytes('abc')).toBe(3)
  })

  it('counts multi-byte characters correctly', () => {
    // Thai: 3 bytes each in UTF-8
    expect(getUtf8Bytes('สวัสดี')).toBe(18)
    // Emoji: 4 bytes in UTF-8
    expect(getUtf8Bytes('😀')).toBe(4)
  })

  it('handles mixed content', () => {
    expect(getUtf8Bytes('aส')).toBe(4)
  })
})

describe('computeTextStats', () => {
  it('returns zeroed stats for empty text', () => {
    const stats = computeTextStats('')
    expect(stats.bytes).toBe(0)
    expect(stats.kilobytes).toBe(0)
    expect(stats.characters).toBe(0)
    expect(stats.words).toBe(0)
    expect(stats.lines).toBe(0)
  })

  it('counts characters using UTF-16 code units', () => {
    const stats = computeTextStats('hello')
    expect(stats.characters).toBe(5)
    expect(stats.charactersNoSpaces).toBe(5)
  })

  it('excludes spaces from charactersNoSpaces', () => {
    const stats = computeTextStats('a b c')
    expect(stats.characters).toBe(5)
    expect(stats.charactersNoSpaces).toBe(3)
  })

  it('counts words correctly', () => {
    expect(computeTextStats('hello world').words).toBe(2)
    expect(computeTextStats('   ').words).toBe(0)
  })

  it('counts lines correctly', () => {
    expect(computeTextStats('one\ntwo\nthree').lines).toBe(3)
    expect(computeTextStats('single').lines).toBe(1)
  })

  it('converts bytes to kilobytes', () => {
    const text = 'a'.repeat(2048)
    const stats = computeTextStats(text)
    expect(stats.bytes).toBe(2048)
    expect(stats.kilobytes).toBe(2)
  })
})

describe('formatSize', () => {
  it('formats bytes below 1 KB', () => {
    expect(formatSize(0)).toBe('0 B')
    expect(formatSize(512)).toBe('512 B')
    expect(formatSize(1023)).toBe('1023 B')
  })

  it('formats kilobytes', () => {
    expect(formatSize(1024)).toBe('1.00 KB')
    expect(formatSize(1536)).toBe('1.50 KB')
  })

  it('formats megabytes', () => {
    expect(formatSize(1024 * 1024)).toBe('1.00 MB')
  })
})
