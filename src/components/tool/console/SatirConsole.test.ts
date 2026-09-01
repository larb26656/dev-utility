import { describe, expect, it } from 'vitest'
import { buildMarkdown, isLevelComplete } from './SatirConsole'
import type { SatirLevels } from '@/stores/satirStore'

const FULL: SatirLevels = {
  behavior: 'I yelled at my teammate.',
  coping: 'Told myself they were incompetent.',
  feelings: 'Anger, hurt, fear.',
  perceptions: 'I must be perfect or I am a failure.',
  yearning: 'To be seen and accepted as I am.',
}

const EMPTY: SatirLevels = {
  behavior: '',
  coping: '   ',
  feelings: '',
  perceptions: '',
  yearning: '',
}

describe('isLevelComplete', () => {
  it('returns true when every level has non-whitespace text', () => {
    expect(isLevelComplete(FULL)).toBe(true)
  })

  it('returns false when any level is missing', () => {
    const partial = { ...FULL, feelings: '' }
    expect(isLevelComplete(partial)).toBe(false)
  })

  it('treats whitespace-only entries as empty', () => {
    expect(isLevelComplete(EMPTY)).toBe(false)
  })
})

describe('buildMarkdown', () => {
  it('includes the current ISO date in the heading', () => {
    const md = buildMarkdown('scenario', FULL, new Date('2026-09-01T10:00:00Z'))
    expect(md).toContain('# Satir Iceberg Reflection — 2026-09-01')
  })

  it('includes scenario under Scenario heading', () => {
    const md = buildMarkdown('a tricky situation', FULL)
    expect(md).toMatch(/## Scenario\n\na tricky situation/)
  })

  it('includes all 5 levels in depth order with bilingual titles', () => {
    const md = buildMarkdown('s', FULL)
    expect(md).toContain('## 1. Behavior — พฤติกรรม')
    expect(md).toContain('## 2. Coping — วิธีรับมือ')
    expect(md).toContain('## 3. Feelings — ความรู้สึก')
    expect(md).toContain('## 4. Perceptions & Beliefs — ความเชื่อ')
    expect(md).toContain('## 5. Yearning / Self — ปรารถนาลึก')
  })

  it('renders placeholder for empty fields', () => {
    const md = buildMarkdown('', EMPTY)
    expect(md).toContain('_(empty)_')
  })

  it('renders placeholder for whitespace-only fields', () => {
    const md = buildMarkdown('  \n  ', EMPTY)
    expect(md).toContain('_(empty)_')
  })

  it('preserves multi-line reflections', () => {
    const levels: SatirLevels = {
      ...EMPTY,
      behavior: 'line one\nline two',
    }
    const md = buildMarkdown('s', levels)
    expect(md).toContain('line one\nline two')
  })

  it('orders headings: scenario before any level', () => {
    const md = buildMarkdown('s', FULL)
    const scenarioIdx = md.indexOf('## Scenario')
    const behaviorIdx = md.indexOf('## 1.')
    expect(scenarioIdx).toBeGreaterThan(-1)
    expect(behaviorIdx).toBeGreaterThan(scenarioIdx)
  })

  it('uses default date when no date is provided', () => {
    const md = buildMarkdown('s', FULL)
    expect(md).toMatch(/# Satir Iceberg Reflection — \d{4}-\d{2}-\d{2}/)
  })
})