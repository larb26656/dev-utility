import { describe, expect, it } from 'vitest'
import {
  TIMEZONES,
  formatDate,
  formatISOWithOffset,
  formatTimestamp,
  getLocalTimezoneOffset,
  getOffsetForDate,
  getTimezoneOffset,
} from './timestampUtils'

describe('getTimezoneOffset', () => {
  it('returns empty string for local', () => {
    expect(getTimezoneOffset('local')).toBe('')
  })

  it('returns +00:00 for UTC', () => {
    expect(getTimezoneOffset('UTC')).toBe('+00:00')
  })

  it('returns correct offset for Asia/Bangkok', () => {
    expect(getTimezoneOffset('Asia/Bangkok')).toBe('+07:00')
  })

  it('returns correct offset for America/New_York', () => {
    expect(getTimezoneOffset('America/New_York')).toBe('-05:00')
  })

  it('returns correct offset for Asia/Tokyo', () => {
    expect(getTimezoneOffset('Asia/Tokyo')).toBe('+09:00')
  })

  it('returns empty string for unknown timezone', () => {
    expect(getTimezoneOffset('Unknown/Zone')).toBe('')
  })
})

describe('getLocalTimezoneOffset', () => {
  it('returns a string in format +HH:MM or -HH:MM', () => {
    const offset = getLocalTimezoneOffset(new Date())
    expect(offset).toMatch(/^[+-]\d{2}:\d{2}$/)
  })

  it('handles single digit hours', () => {
    // This tests the normalization logic
    const offset = getLocalTimezoneOffset(new Date('2024-01-01T00:00:00Z'))
    expect(offset).toMatch(/^[+-]\d{2}:\d{2}$/)
  })
})

describe('getOffsetForDate', () => {
  it('uses getLocalTimezoneOffset for local', () => {
    const date = new Date('2024-07-18T10:00:00Z')
    const offset = getOffsetForDate(date, 'local')
    expect(offset).toMatch(/^[+-]\d{2}:\d{2}$/)
  })

  it('uses getTimezoneOffset for UTC', () => {
    const date = new Date('2024-07-18T10:00:00Z')
    expect(getOffsetForDate(date, 'UTC')).toBe('+00:00')
  })

  it('uses getTimezoneOffset for named timezone', () => {
    const date = new Date('2024-07-18T10:00:00Z')
    expect(getOffsetForDate(date, 'Asia/Bangkok')).toBe('+07:00')
  })

  it('returns DST offset for America/New_York in July', () => {
    const date = new Date('2024-07-18T10:30:00.000Z')
    expect(getOffsetForDate(date, 'America/New_York')).toBe('-04:00')
  })

  it('returns DST offset for Europe/London in July', () => {
    const date = new Date('2024-07-18T10:30:00.000Z')
    expect(getOffsetForDate(date, 'Europe/London')).toBe('+01:00')
  })

  it('returns non-DST offset for America/New_York in January', () => {
    const date = new Date('2024-01-18T10:30:00.000Z')
    expect(getOffsetForDate(date, 'America/New_York')).toBe('-05:00')
  })
})

describe('formatTimestamp', () => {
  it('returns correct ms and s for a known date', () => {
    // 2024-07-18T10:30:00.000Z = 1721298600000
    const date = new Date('2024-07-18T10:30:00.000Z')
    const result = formatTimestamp(date)
    expect(result.ms).toBe(1721298600000)
    expect(result.s).toBe(1721298600)
  })

  it('handles epoch date', () => {
    const date = new Date(0)
    const result = formatTimestamp(date)
    expect(result.ms).toBe(0)
    expect(result.s).toBe(0)
  })
})

describe('formatDate', () => {
  it('formats date in UTC', () => {
    const date = new Date('2024-07-18T10:30:00.000Z')
    const result = formatDate(date, 'UTC')
    expect(result).toContain('Jul')
    expect(result).toContain('2024')
    expect(result).toContain('10:30:00')
  })

  it('formats date in Asia/Bangkok with correct time', () => {
    const date = new Date('2024-07-18T10:30:00.000Z')
    const result = formatDate(date, 'Asia/Bangkok')
    expect(result).toContain('Jul')
    expect(result).toContain('2024')
    expect(result).toContain('17:30:00') // Bangkok is UTC+7
  })

  it('formats date in January (non-DST) for America/New_York', () => {
    // January - New York is definitely UTC-5 (no DST)
    const date = new Date('2024-01-18T10:30:00.000Z')
    const result = formatDate(date, 'America/New_York')
    expect(result).toContain('Jan')
    expect(result).toContain('2024')
    expect(result).toContain('05:30:00') // New York in Jan is UTC-5
  })
})

describe('formatISOWithOffset', () => {
  it('formats UTC date with Z', () => {
    const date = new Date('2024-07-18T10:30:00.000Z')
    const result = formatISOWithOffset(date, 'UTC')
    expect(result).toBe('2024-07-18T10:30:00.000Z')
  })

  it('formats date with +07:00 offset for Bangkok', () => {
    const date = new Date('2024-07-18T03:30:00.000Z')
    const result = formatISOWithOffset(date, 'Asia/Bangkok')
    expect(result).toBe('2024-07-18T10:30:00.000+07:00')
  })

  it('formats date with -05:00 offset for New York in January (no DST)', () => {
    const date = new Date('2024-01-18T10:30:00.000Z')
    const result = formatISOWithOffset(date, 'America/New_York')
    expect(result).toBe('2024-01-18T05:30:00.000-05:00')
  })

  it('formats date with -04:00 offset for New York in July (DST)', () => {
    const date = new Date('2024-07-18T10:30:00.000Z')
    const result = formatISOWithOffset(date, 'America/New_York')
    expect(result).toBe('2024-07-18T06:30:00.000-04:00')
  })

  it('formats date with +01:00 offset for London in July (BST)', () => {
    const date = new Date('2024-07-18T10:30:00.000Z')
    const result = formatISOWithOffset(date, 'Europe/London')
    expect(result).toBe('2024-07-18T11:30:00.000+01:00')
  })

  it('includes milliseconds in output', () => {
    const date = new Date('2024-07-18T10:30:00.123Z')
    const result = formatISOWithOffset(date, 'UTC')
    expect(result).toBe('2024-07-18T10:30:00.123Z')
  })

  it('formats local timezone with proper offset format', () => {
    const date = new Date('2024-07-18T10:30:00.000Z')
    const result = formatISOWithOffset(date, 'local')
    // Should match ISO format with offset like +07:00 or -05:00
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}$|^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
  })
})

describe('TIMEZONES', () => {
  it('contains local and UTC', () => {
    const local = TIMEZONES.find((t) => t.id === 'local')
    const utc = TIMEZONES.find((t) => t.id === 'UTC')
    expect(local).toBeDefined()
    expect(utc).toBeDefined()
  })

  it('contains Asian timezones', () => {
    const bangkok = TIMEZONES.find((t) => t.id === 'Asia/Bangkok')
    const tokyo = TIMEZONES.find((t) => t.id === 'Asia/Tokyo')
    expect(bangkok?.offset).toBe('+07:00')
    expect(tokyo?.offset).toBe('+09:00')
  })

  it('contains American timezones', () => {
    const newYork = TIMEZONES.find((t) => t.id === 'America/New_York')
    const la = TIMEZONES.find((t) => t.id === 'America/Los_Angeles')
    expect(newYork?.offset).toBe('-05:00')
    expect(la?.offset).toBe('-08:00')
  })

  it('contains European timezones', () => {
    const london = TIMEZONES.find((t) => t.id === 'Europe/London')
    const paris = TIMEZONES.find((t) => t.id === 'Europe/Paris')
    expect(london?.offset).toBe('+00:00')
    expect(paris?.offset).toBe('+01:00')
  })

  it('contains Pacific timezones', () => {
    const sydney = TIMEZONES.find((t) => t.id === 'Australia/Sydney')
    const auckland = TIMEZONES.find((t) => t.id === 'Pacific/Auckland')
    expect(sydney?.offset).toBe('+10:00')
    expect(auckland?.offset).toBe('+12:00')
  })
})
