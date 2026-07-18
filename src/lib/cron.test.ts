import { describe, expect, it } from 'vitest'
import {
  buildCronExpression,
  getCronDescription,
  getNextRunDate,
  getNextRuns,
  isValidCronParts,
  parseCronExpression,
  validateCronExpression,
} from './cron'

describe('cron', () => {
  describe('parseCronExpression', () => {
    it('parses valid cron expression', () => {
      const result = parseCronExpression('30 9 * * *')
      expect(result).toEqual({
        minute: '30',
        hour: '9',
        dayOfMonth: '*',
        month: '*',
        dayOfWeek: '*',
      })
    })

    it('returns null for invalid cron expression', () => {
      expect(parseCronExpression('invalid')).toBeNull()
      expect(parseCronExpression('')).toBeNull()
      expect(parseCronExpression('* * *')).toBeNull()
      expect(parseCronExpression('* * * * * *')).toBeNull()
    })

    it('parses cron with specific values', () => {
      const result = parseCronExpression('0 0 1 1,4,7,10 *')
      expect(result).toEqual({
        minute: '0',
        hour: '0',
        dayOfMonth: '1',
        month: '1,4,7,10',
        dayOfWeek: '*',
      })
    })

    it('handles whitespace properly', () => {
      const result = parseCronExpression('  30   9   *   *   *  ')
      expect(result).toEqual({
        minute: '30',
        hour: '9',
        dayOfMonth: '*',
        month: '*',
        dayOfWeek: '*',
      })
    })
  })

  describe('buildCronExpression', () => {
    it('builds cron expression from parts', () => {
      const result = buildCronExpression({
        minute: '30',
        hour: '9',
        dayOfMonth: '*',
        month: '*',
        dayOfWeek: '*',
      })
      expect(result).toBe('30 9 * * *')
    })

    it('builds cron with complex values', () => {
      const result = buildCronExpression({
        minute: '0',
        hour: '0',
        dayOfMonth: '1',
        month: '1,4,7,10',
        dayOfWeek: '1-5',
      })
      expect(result).toBe('0 0 1 1,4,7,10 1-5')
    })

    it('roundtrips with parseCronExpression', () => {
      const original = '15 8 * * 1'
      const parsed = parseCronExpression(original)
      expect(parsed).not.toBeNull()
      const rebuilt = buildCronExpression(parsed!)
      expect(rebuilt).toBe(original)
    })
  })

  describe('validateCronExpression', () => {
    it('validates correct cron expressions', () => {
      expect(validateCronExpression('* * * * *')).toBe(true)
      expect(validateCronExpression('0 9 * * *')).toBe(true)
      expect(validateCronExpression('*/5 * * * *')).toBe(true)
      expect(validateCronExpression('0 0 1 * *')).toBe(true)
      expect(validateCronExpression('30 0 * * *')).toBe(true)
      expect(validateCronExpression('0 9 * * 1-5')).toBe(true)
      expect(validateCronExpression('0 0 1 1,4,7,10 *')).toBe(true)
    })

    it('rejects invalid cron expressions', () => {
      expect(validateCronExpression('invalid')).toBe(false)
      expect(validateCronExpression('60 * * * *')).toBe(false)
      expect(validateCronExpression('* 25 * * *')).toBe(false)
    })
  })

  describe('getCronDescription', () => {
    it('returns human-readable description', () => {
      expect(getCronDescription('* * * * *')).toBe('Every minute')
      expect(getCronDescription('0 * * * *')).toBe('Every hour')
      expect(getCronDescription('0 0 * * *')).toBe('At 12:00 AM')
      expect(getCronDescription('30 0 * * *')).toBe('At 12:30 AM')
      expect(getCronDescription('0 9 * * *')).toBe('At 09:00 AM')
      expect(getCronDescription('0 9 * * 1-5')).toBe('At 09:00 AM, Monday through Friday')
      expect(getCronDescription('0 0 1 * *')).toBe('At 12:00 AM, on day 1 of the month')
      expect(getCronDescription('*/15 * * * *')).toBe('Every 15 minutes')
    })

    it('returns "Invalid expression" for invalid cron', () => {
      expect(getCronDescription('invalid')).toBe('Invalid expression')
      expect(getCronDescription('')).toBe('Invalid expression')
    })
  })

  describe('getNextRuns', () => {
    it('returns next N execution times as ISO strings', () => {
      const runs = getNextRuns('0 9 * * *', 3)
      expect(runs).toHaveLength(3)
      runs.forEach((run) => {
        expect(run).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
      })
    })

    it('returns empty array for invalid expression', () => {
      expect(getNextRuns('invalid', 5)).toEqual([])
    })

    it('returns correct number of runs', () => {
      expect(getNextRuns('* * * * *', 1)).toHaveLength(1)
      expect(getNextRuns('* * * * *', 10)).toHaveLength(10)
      expect(getNextRuns('* * * * *', 0)).toHaveLength(0)
    })

    it('returns runs in chronological order', () => {
      const runs = getNextRuns('0 * * * *', 5)
      for (let i = 1; i < runs.length; i++) {
        expect(new Date(runs[i]).getTime()).toBeGreaterThan(new Date(runs[i - 1]).getTime())
      }
    })
  })

  describe('getNextRunDate', () => {
    it('returns next execution as Date', () => {
      const nextRun = getNextRunDate('0 9 * * *')
      expect(nextRun).toBeInstanceOf(Date)
    })

    it('returns null for invalid expression', () => {
      expect(getNextRunDate('invalid')).toBeNull()
    })
  })

  describe('isValidCronParts', () => {
    it('returns true for complete parts', () => {
      expect(
        isValidCronParts({
          minute: '30',
          hour: '9',
          dayOfMonth: '*',
          month: '*',
          dayOfWeek: '*',
        }),
      ).toBe(true)
    })

    it('returns false for incomplete parts', () => {
      expect(
        isValidCronParts({
          minute: '30',
          hour: '9',
          dayOfMonth: '*',
          month: '*',
        }),
      ).toBe(false)
      expect(isValidCronParts({})).toBe(false)
    })
  })

  describe('integration', () => {
    it('handles common cron patterns correctly', () => {
      const patterns = [
        { cron: '* * * * *', expectedDescription: 'Every minute' },
        { cron: '*/5 * * * *', expectedDescription: 'Every 5 minutes' },
        { cron: '0 * * * *', expectedDescription: 'Every hour' },
        { cron: '0 0 * * *', expectedDescription: 'At 12:00 AM' },
        { cron: '0 9 * * *', expectedDescription: 'At 09:00 AM' },
        { cron: '30 0 * * *', expectedDescription: 'At 12:30 AM' },
        { cron: '0 9 * * 1-5', expectedDescription: 'At 09:00 AM, Monday through Friday' },
        { cron: '0 0 1 * *', expectedDescription: 'At 12:00 AM, on day 1 of the month' },
        { cron: '0 0 1 1,4,7,10 *', expectedDescription: 'At 12:00 AM, on day 1 of the month, only in January, April, July, and October' },
      ]

      patterns.forEach(({ cron, expectedDescription }) => {
        expect(validateCronExpression(cron)).toBe(true)
        expect(getCronDescription(cron)).toBe(expectedDescription)
      })
    })

    it('roundtrips various cron expressions', () => {
      const expressions = [
        '* * * * *',
        '0 9 * * *',
        '*/15 * * * *',
        '0 0 1 * *',
        '30 0 * * *',
        '0 9 * * 1-5',
        '0 0 1 1,4,7,10 *',
        '15 8 * * 1',
      ]

      expressions.forEach((original) => {
        const parsed = parseCronExpression(original)
        expect(parsed).not.toBeNull()
        const rebuilt = buildCronExpression(parsed!)
        expect(rebuilt).toBe(original)
      })
    })
  })
})
