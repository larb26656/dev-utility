import { describe, expect, it } from 'vitest'

import {
  PakoDecodeError,
  buildMermaidInkUrl,
  buildMermaidLiveUrl,
  decodeState,
  encodeState,
  extractCode,
} from './mermaid-pako'

const sampleState = {
  code: 'graph TD\n  A[Christmas] -->|Get money| B(Go shopping)\n  B --> C{Let me think}\n  C -->|One| D[Laptop]\n  C -->|Two| E[iPhone]\n  C -->|Three| F[fa:fa-car Car]\n\t\t',
  mermaid: '{\n  "theme": "default"\n}',
  updateEditor: true,
  autoSync: true,
  updateDiagram: true,
}

const sampleFragment =
  'eNpNkM9qwzAMh19F6NRB8wI5DNak7aWwwXqLexCxUpvNf3AURkny7rNbynaTPn0_ITRjHzRjjddE0cC5VR7grWtMsqM4Gi9QVa_LkQVc8HxbYLc5BhhNiNH660uxd0WBZj4ViUGM9V9rGTT37LvnBdruRFFCvPzx809YYN_ZD5MX_-cmcU4cuoHqgaqeEjSUsqBECW7RcXJkdT55LiGFYtixwjqXmgeavkWh8mtWp6hJeK-thIS1pIm3SJOEz5vvn_3DaS3lB7gHXH8BFrFcZw'

describe('mermaid-pako', () => {
  describe('encodeState', () => {
    it('produces a pako: prefixed fragment', () => {
      const result = encodeState({ code: 'A-->B' })
      expect(result.startsWith('pako:')).toBe(true)
    })

    it('produces url-safe base64 with no padding', () => {
      const result = encodeState({ code: 'A-->B' })
      expect(result).not.toContain('+')
      expect(result).not.toContain('/')
      expect(result).not.toContain('=')
    })

    it('is deterministic', () => {
      expect(encodeState({ code: 'A-->B' })).toBe(encodeState({ code: 'A-->B' }))
    })
  })

  describe('decodeState', () => {
    it('decodes a known mermaid.live fragment', () => {
      const decoded = decodeState(sampleFragment)
      expect(decoded).toEqual(sampleState)
    })

    it('strips the pako: prefix', () => {
      const decoded = decodeState(`pako:${sampleFragment}`)
      expect(decoded).toEqual(sampleState)
    })

    it('strips a leading mermaid.live URL', () => {
      const decoded = decodeState(`https://mermaid.live/edit#pako:${sampleFragment}`)
      expect(decoded).toEqual(sampleState)
    })

    it('strips a leading mermaid.ink/img/ path', () => {
      const decoded = decodeState(`https://mermaid.ink/img/pako:${sampleFragment}`)
      expect(decoded).toEqual(sampleState)
    })

    it('handles a path-based pako URL with query string', () => {
      const decoded = decodeState(
        `https://mermaid.ink/img/pako:${sampleFragment}?type=png&bgColor=white`,
      )
      expect(decoded).toEqual(sampleState)
    })

    it('trims surrounding whitespace', () => {
      const decoded = decodeState(`  pako:${sampleFragment}  `)
      expect(decoded).toEqual(sampleState)
    })
  })

  describe('extractCode', () => {
    it('returns the code field from a decoded state', () => {
      expect(extractCode(sampleFragment)).toBe(sampleState.code)
    })

    it('throws PakoDecodeError when code is missing', () => {
      const fragment = encodeState({ notCode: 'oops' } as unknown as Parameters<typeof encodeState>[0])
      expect(() => extractCode(fragment)).toThrow(PakoDecodeError)
    })

    it('throws on empty input', () => {
      expect(() => extractCode('')).toThrow(PakoDecodeError)
    })

    it('throws on garbage input', () => {
      expect(() => extractCode('pako:not-real-base64!!!')).toThrow(PakoDecodeError)
    })
  })

  describe('buildMermaidLiveUrl', () => {
    it('wraps a fragment with the mermaid.live URL using #', () => {
      const url = buildMermaidLiveUrl(sampleFragment)
      expect(url).toBe(`https://mermaid.live/edit#pako:${sampleFragment}`)
    })

    it('does not double-prefix when fragment already has pako:', () => {
      const url = buildMermaidLiveUrl(`pako:${sampleFragment}`)
      expect(url).toBe(`https://mermaid.live/edit#pako:${sampleFragment}`)
    })
  })

  describe('buildMermaidInkUrl', () => {
    it('wraps a fragment with the mermaid.ink/img/ URL using path', () => {
      const url = buildMermaidInkUrl(sampleFragment)
      expect(url).toBe(`https://mermaid.ink/img/pako:${sampleFragment}`)
    })

    it('does not double-prefix when fragment already has pako:', () => {
      const url = buildMermaidInkUrl(`pako:${sampleFragment}`)
      expect(url).toBe(`https://mermaid.ink/img/pako:${sampleFragment}`)
    })
  })

  describe('roundtrip', () => {
    it('encode then decode returns the same state', () => {
      const encoded = encodeState(sampleState)
      const decoded = decodeState(encoded)
      expect(decoded).toEqual(sampleState)
    })

    it('encode then extractCode returns the original code', () => {
      const encoded = encodeState(sampleState)
      expect(extractCode(encoded)).toBe(sampleState.code)
    })

    it('roundtrips unicode payloads', () => {
      const payload = { code: 'graph TD\n  A["สวัสดี"] --> B["你好"]' }
      expect(extractCode(encodeState(payload))).toBe(payload.code)
    })

    it('roundtrips an empty code', () => {
      expect(extractCode(encodeState({ code: '' }))).toBe('')
    })
  })
})
