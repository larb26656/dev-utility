import { describe, expect, it } from 'vitest'
import { urlDecode, urlEncode, urlEscapeTool } from './url-escape'

const { convert: encode } = urlEscapeTool.a
const { convert: decode } = urlEscapeTool.b

describe('URL Escape', () => {
  describe('urlEncode', () => {
    it('encodes spaces', () => {
      expect(urlEncode('hello world')).toBe('hello%20world')
    })

    it('encodes special characters', () => {
      expect(urlEncode('a=b&c=d')).toBe('a%3Db%26c%3Dd')
    })

    it('encodes unicode characters', () => {
      expect(urlEncode('สวัสดี')).toBeTruthy()
    })

    it('encodes slashes', () => {
      expect(urlEncode('path/to/file')).toBe('path%2Fto%2Ffile')
    })
  })

  describe('urlDecode', () => {
    it('decodes encoded spaces', () => {
      expect(urlDecode('hello%20world')).toBe('hello world')
    })

    it('decodes encoded special characters', () => {
      expect(urlDecode('a%3Db%26c%3Dd')).toBe('a=b&c=d')
    })

    it('decodes encoded slashes', () => {
      expect(urlDecode('path%2Fto%2Ffile')).toBe('path/to/file')
    })
  })

  describe('encode (tool.a)', () => {
    it('encodes plain text', () => {
      expect(encode('hello world')).toBe('hello%20world')
    })
  })

  describe('decode (tool.b)', () => {
    it('decodes URL encoded text', () => {
      expect(decode('hello%20world')).toBe('hello world')
    })
  })

  describe('roundtrip', () => {
    it('encode then decode returns original text', () => {
      const original = 'Hello World!'
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
      const original = 'key=value&other=123'
      const encoded = encode(original)
      const decoded = decode(encoded)
      expect(decoded).toBe(original)
    })

    it('handles path roundtrip', () => {
      const original = '/api/v1/users/123'
      const encoded = encode(original)
      const decoded = decode(encoded)
      expect(decoded).toBe(original)
    })

    it('handles query string roundtrip', () => {
      const original = 'name=John Doe&city=Bangkok'
      const encoded = encode(original)
      const decoded = decode(encoded)
      expect(decoded).toBe(original)
    })
  })
})
