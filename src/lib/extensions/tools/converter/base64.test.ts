import { describe, expect, it } from 'vitest'
import { base64Decode, base64Encode, base64Tool } from './base64'

const { convert: encode } = base64Tool.a
const { convert: decode } = base64Tool.b

describe('Base64', () => {
  describe('base64Encode', () => {
    it('encodes text to base64', () => {
      expect(base64Encode('hello')).toBe('aGVsbG8=')
    })

    it('encodes empty string', () => {
      expect(base64Encode('')).toBe('')
    })

    it('encodes unicode characters', () => {
      expect(base64Encode('สวัสดี')).toBeTruthy()
    })
  })

  describe('base64Decode', () => {
    it('decodes base64 to text', () => {
      expect(base64Decode('aGVsbG8=')).toBe('hello')
    })

    it('decodes empty string', () => {
      expect(base64Decode('')).toBe('')
    })
  })

  describe('encode (tool.a)', () => {
    it('encodes text to base64', () => {
      expect(encode('hello')).toBe('aGVsbG8=')
    })

    it('produces valid base64 string', () => {
      const result = encode('test')
      expect(result).toMatch(/^[A-Za-z0-9+/]*={0,2}$/)
    })
  })

  describe('decode (tool.b)', () => {
    it('decodes base64 to text', () => {
      expect(decode('aGVsbG8=')).toBe('hello')
    })
  })

  describe('roundtrip', () => {
    it('encode then decode returns original text', () => {
      const original = 'Hello, World!'
      const encoded = encode(original)
      const decoded = decode(encoded)
      expect(decoded).toBe(original)
    })

    it('handles unicode text roundtrip', () => {
      const original = '你好世界'
      const encoded = encode(original)
      const decoded = decode(encoded)
      expect(decoded).toBe(original)
    })

    it('handles special characters roundtrip', () => {
      const original = '!@#$%^&*()_+-=[]{}|;:,.<>?'
      const encoded = encode(original)
      const decoded = decode(encoded)
      expect(decoded).toBe(original)
    })
  })
})
