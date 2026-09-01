import { describe, expect, it } from 'vitest'
import {
  SATIR_SUGGESTIONS,
  appendSuggestion,
  hasSuggestions,
} from './satirSuggestions'
import type { SatirLevel } from '@/stores/satirStore'

const ALL_LEVELS: ReadonlyArray<SatirLevel> = [
  'behavior',
  'coping',
  'feelings',
  'perceptions',
  'yearning',
]

describe('SATIR_SUGGESTIONS integrity', () => {
  it('provides data for all 5 iceberg levels', () => {
    for (const level of ALL_LEVELS) {
      expect(SATIR_SUGGESTIONS[level]).toBeDefined()
    }
  })

  it('every level has at least one group with at least one item', () => {
    for (const level of ALL_LEVELS) {
      const set = SATIR_SUGGESTIONS[level]
      expect(set.groups.length).toBeGreaterThan(0)
      for (const group of set.groups) {
        expect(group.items.length).toBeGreaterThan(0)
      }
    }
  })

  it('has no duplicate items within any group', () => {
    for (const level of ALL_LEVELS) {
      for (const group of SATIR_SUGGESTIONS[level].groups) {
        const set = new Set(group.items)
        expect(set.size).toBe(group.items.length)
      }
    }
  })

  it('has no empty-string items', () => {
    for (const level of ALL_LEVELS) {
      for (const group of SATIR_SUGGESTIONS[level].groups) {
        for (const item of group.items) {
          expect(item.trim().length).toBeGreaterThan(0)
        }
      }
    }
  })

  it('feelings, perceptions and yearning include prompts (richer levels)', () => {
    for (const level of ['feelings', 'perceptions', 'yearning'] as const) {
      expect(SATIR_SUGGESTIONS[level].prompts?.length ?? 0).toBeGreaterThan(0)
    }
  })
})

describe('hasSuggestions', () => {
  it('returns true when level has groups or prompts', () => {
    for (const level of ALL_LEVELS) {
      expect(hasSuggestions(level)).toBe(true)
    }
  })
})

describe('appendSuggestion', () => {
  it('returns just the addition for empty current', () => {
    expect(appendSuggestion('', 'โกรธ')).toBe('โกรธ')
  })

  it('returns just the addition for whitespace-only current', () => {
    expect(appendSuggestion('   \n  ', 'โกรธ')).toBe('โกรธ')
  })

  it('separates with newline when current has content', () => {
    expect(appendSuggestion('ทะเลาะกับเพื่อน', 'โกรธ')).toBe(
      'ทะเลาะกับเพื่อน\nโกรธ',
    )
  })

  it('trims trailing whitespace before adding separator', () => {
    expect(appendSuggestion('hello   ', 'world')).toBe('hello\nworld')
  })

  it('does not duplicate trailing newline', () => {
    expect(appendSuggestion('hello\n\n', 'world')).toBe('hello\nworld')
  })

  it('handles single trailing newline', () => {
    expect(appendSuggestion('hello\n', 'world')).toBe('hello\nworld')
  })

  it('preserves internal whitespace within the addition', () => {
    expect(appendSuggestion('hello', 'a b c')).toBe('hello\na b c')
  })

  it('supports back-to-back calls (chip stacking)', () => {
    const first = appendSuggestion('hello', 'โกรธ')
    const second = appendSuggestion(first, 'กลัว')
    expect(second).toBe('hello\nโกรธ\nกลัว')
  })

  it('treats tabs as trailing whitespace', () => {
    expect(appendSuggestion('hello\t\t', 'world')).toBe('hello\nworld')
  })
})