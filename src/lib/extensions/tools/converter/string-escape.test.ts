import { describe, expect, it } from 'vitest'
import { escapeString, stringEscapeTool, unescapeString } from './string-escape'

const { convert: escape } = stringEscapeTool.a
const { convert: unescape } = stringEscapeTool.b

describe('String Escape', () => {
  describe('escapeString', () => {
    it('escapes backslashes', () => {
      expect(escapeString('a\\b')).toBe('a\\\\b')
    })

    it('escapes double quotes', () => {
      expect(escapeString('say "hello"')).toBe('say \\"hello\\"')
    })

    it('does not escape single quotes (JSON behavior)', () => {
      expect(escapeString("it's cool")).toBe("it's cool")
    })

    it('escapes newlines', () => {
      const input = 'line1\nline2'
      const result = escapeString(input)
      expect(result).toBe('line1\\nline2')
    })

    it('escapes tabs', () => {
      expect(escapeString('col1\tcol2')).toBe('col1\\tcol2')
    })
  })

  describe('unescapeString', () => {
    it('unescapes double quotes', () => {
      expect(unescapeString('say \\"hello\\"')).toBe('say "hello"')
    })

    it('unescapes backslashes', () => {
      expect(unescapeString('a\\\\b')).toBe('a\\b')
    })

    it('unescapes newlines', () => {
      expect(unescapeString('line1\\nline2')).toBe('line1\nline2')
    })

    it('unescapes tabs', () => {
      expect(unescapeString('col1\\tcol2')).toBe('col1\tcol2')
    })
  })

  describe('roundtrip', () => {
    it('roundtrips text with special characters', () => {
      const original = 'Hello "World"'
      expect(unescape(escape(original))).toBe(original)
    })

    it('roundtrips text with newlines', () => {
      const original = 'Line1\nLine2'
      expect(unescape(escape(original))).toBe(original)
    })

    it('roundtrips text with tabs', () => {
      const original = 'Col1\tCol2'
      expect(unescape(escape(original))).toBe(original)
    })

    it('roundtrips text with backslashes', () => {
      const original = 'path\\to\\file'
      expect(unescape(escape(original))).toBe(original)
    })

    it('roundtrips empty string', () => {
      expect(unescape(escape(''))).toBe('')
    })

    it('roundtrips mixed special characters', () => {
      const original = 'Hello "World"\nNext line\ttab'
      expect(unescape(escape(original))).toBe(original)
    })

    it('roundtrips unicode characters', () => {
      const original = 'สวัสดี ครับ'
      expect(unescape(escape(original))).toBe(original)
    })
  })
})
