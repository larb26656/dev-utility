import { deflate, inflate } from 'pako'

export interface MermaidState {
  code: string
  [key: string]: unknown
}

const PAKO_PREFIX = 'pako:'
const MERMAID_LIVE_URL = 'https://mermaid.live/edit'
const MERMAID_INK_URL = 'https://mermaid.ink/img/'

export class PakoDecodeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PakoDecodeError'
  }
}

function truncateAtBoundary(s: string): string {
  const stopIdx = s.search(/[\s?&]/)
  return stopIdx >= 0 ? s.slice(0, stopIdx) : s
}

function stripPakoPrefix(input: string): string {
  const trimmed = input.trim()

  const hashIdx = trimmed.lastIndexOf('#')
  if (hashIdx >= 0) {
    const afterHash = truncateAtBoundary(trimmed.slice(hashIdx + 1))
    if (afterHash.startsWith(PAKO_PREFIX)) {
      return afterHash.slice(PAKO_PREFIX.length)
    }
  }

  const lastPako = trimmed.lastIndexOf(PAKO_PREFIX)
  if (lastPako >= 0) {
    return truncateAtBoundary(trimmed.slice(lastPako + PAKO_PREFIX.length))
  }

  return hashIdx >= 0 ? truncateAtBoundary(trimmed.slice(hashIdx + 1)) : trimmed
}

function fromBase64Url(input: string): Uint8Array {
  const padded = input
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(input.length + ((4 - (input.length % 4)) % 4), '=')

  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  bytes.forEach((b) => (binary += String.fromCharCode(b)))
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export function encodeState(state: MermaidState): string {
  const json = JSON.stringify(state)
  const bytes = deflate(json)
  return `${PAKO_PREFIX}${toBase64Url(bytes)}`
}

export function decodeState(input: string): MermaidState {
  const cleaned = stripPakoPrefix(input)
  if (!cleaned) throw new PakoDecodeError('Empty pako payload')
  let bytes: Uint8Array
  try {
    bytes = fromBase64Url(cleaned)
  } catch (err) {
    throw new PakoDecodeError(
      err instanceof Error ? `Invalid base64: ${err.message}` : 'Invalid base64',
    )
  }
  let json: string
  try {
    json = inflate(bytes, { toText: true })
  } catch (err) {
    throw new PakoDecodeError(
      err instanceof Error ? `Inflate failed: ${err.message}` : 'Inflate failed',
    )
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch (err) {
    throw new PakoDecodeError(
      err instanceof Error ? `Invalid JSON: ${err.message}` : 'Invalid JSON',
    )
  }
  if (typeof parsed !== 'object' || parsed === null) {
    throw new PakoDecodeError('Decoded payload is not an object')
  }
  return parsed as MermaidState
}

export function extractCode(input: string): string {
  const state = decodeState(input)
  const code = state.code
  if (typeof code !== 'string') {
    throw new PakoDecodeError('Decoded state has no `code` field')
  }
  return code
}

export function buildMermaidLiveUrl(fragment: string): string {
  return buildPakoUrl('live', fragment)
}

export function buildMermaidInkUrl(fragment: string): string {
  return buildPakoUrl('ink', fragment)
}

function buildPakoUrl(
  kind: 'live' | 'ink',
  fragment: string,
): string {
  const normalized = fragment.startsWith(PAKO_PREFIX)
    ? fragment
    : `${PAKO_PREFIX}${fragment}`
  const base = kind === 'live' ? MERMAID_LIVE_URL : MERMAID_INK_URL
  const separator = kind === 'live' ? '#' : ''
  return `${base}${separator}${normalized}`
}
