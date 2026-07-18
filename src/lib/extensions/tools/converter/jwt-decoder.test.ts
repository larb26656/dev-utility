import { describe, expect, it } from 'vitest'
import { jwtDecoderTool } from './jwt-decoder'

describe('JWT Decoder', () => {
  it('has correct tool metadata', () => {
    expect(jwtDecoderTool.id).toBe('jwt-decoder')
    expect(jwtDecoderTool.name).toBe('JWT Decoder')
    expect(jwtDecoderTool.category).toBe('Converter')
  })

  it('is a one-way transformer tool type', () => {
    expect(jwtDecoderTool.type).toBe('transformer')
    expect(jwtDecoderTool.transformType).toBe('one-way')
  })

  describe('convert', () => {
    it('decodes a valid JWT token', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      const result = jwtDecoderTool.convert(token)

      const parsed = JSON.parse(result)
      expect(parsed.header.alg).toBe('HS256')
      expect(parsed.header.typ).toBe('JWT')
      expect(parsed.payload.sub).toBe('1234567890')
      expect(parsed.payload.name).toBe('John Doe')
      expect(parsed.payload.iat).toBe(1516239022)
      expect(parsed.signature).toBe('SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')
    })

    it('detects expired token', () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZXhwIjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      const result = jwtDecoderTool.convert(expiredToken)

      const parsed = JSON.parse(result)
      expect(parsed.isExpired).toBe(true)
      expect(parsed.expiresAt).toBe('2018-01-18T01:30:22.000Z')
    })

    it('detects non-expired token', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZXhwIjo5OTk5OTk5OTk5fQ.signature'
      const result = jwtDecoderTool.convert(token)

      const parsed = JSON.parse(result)
      expect(parsed.isExpired).toBe(false)
      expect(parsed.expiresAt).not.toBeNull()
    })

    it('handles token without exp claim', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature'
      const result = jwtDecoderTool.convert(token)

      const parsed = JSON.parse(result)
      expect(parsed.isExpired).toBe(false)
      expect(parsed.expiresAt).toBeNull()
    })
  })

  describe('error handling', () => {
    it('throws error for invalid JWT format (not 3 parts)', () => {
      expect(() => jwtDecoderTool.convert('invalid.token')).toThrow(
        'Invalid JWT format. Expected 3 parts separated by dots.'
      )
    })

    it('throws error for JWT with only 2 parts', () => {
      expect(() => jwtDecoderTool.convert('part1.part2')).toThrow(
        'Invalid JWT format. Expected 3 parts separated by dots.'
      )
    })

    it('throws error for empty string', () => {
      expect(() => jwtDecoderTool.convert('')).toThrow(
        'Invalid JWT format. Expected 3 parts separated by dots.'
      )
    })

    it('throws error for whitespace only', () => {
      expect(() => jwtDecoderTool.convert('   ')).toThrow(
        'Invalid JWT format. Expected 3 parts separated by dots.'
      )
    })
  })

  describe('edge cases', () => {
    it('handles token with extra whitespace', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature   '
      const result = jwtDecoderTool.convert(token)

      const parsed = JSON.parse(result)
      expect(parsed.payload.sub).toBe('1234567890')
    })

    it('handles token with leading whitespace', () => {
      const token = '   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature'
      const result = jwtDecoderTool.convert(token)

      const parsed = JSON.parse(result)
      expect(parsed.payload.sub).toBe('1234567890')
    })
  })
})