import { describe, expect, it } from 'vitest'
import { parseTasks } from './EisenhowerConsole'

describe('parseTasks', () => {
  it('splits input by newline character', () => {
    expect(parseTasks('a\nb\nc')).toEqual(['a', 'b', 'c'])
  })

  it('trims whitespace from each line', () => {
    expect(parseTasks('  a  \n  b  \n  c  ')).toEqual(['a', 'b', 'c'])
  })

  it('filters empty lines', () => {
    expect(parseTasks('a\n\nb\n   \nc')).toEqual(['a', 'b', 'c'])
  })

  it('returns empty array for empty input', () => {
    expect(parseTasks('')).toEqual([])
  })

  it('returns empty array when only whitespace is provided', () => {
    expect(parseTasks('   \n  \n\t\n')).toEqual([])
  })

  it('handles trailing newline', () => {
    expect(parseTasks('a\nb\nc\n')).toEqual(['a', 'b', 'c'])
  })

  it('handles leading newline', () => {
    expect(parseTasks('\na\nb')).toEqual(['a', 'b'])
  })

  it('handles consecutive newlines', () => {
    expect(parseTasks('a\n\n\nb')).toEqual(['a', 'b'])
  })

  it('preserves internal spaces in single task', () => {
    expect(parseTasks('write a detailed report')).toEqual(['write a detailed report'])
  })

  it('handles single line input', () => {
    expect(parseTasks('only one task')).toEqual(['only one task'])
  })
})
