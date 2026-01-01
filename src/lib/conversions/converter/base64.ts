import type { TwoWayConversion } from '@/lib/types/two-way'

export function base64Encode(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  bytes.forEach((b) => (binary += String.fromCharCode(b)))
  return btoa(binary)
}

export function base64Decode(base64: string): string {
  const binary = atob(base64)
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export const base64Conversion: TwoWayConversion<string, string> = {
  id: 'base64',
  name: 'Base64',
  category: 'Converter',
  type: 'two-way',
  label: 'Base64',
  a: {
    label: 'Text',
    convert: (input) => {
      return base64Encode(input)
    },
  },
  b: {
    label: 'Base64',
    convert: (input) => {
      return base64Decode(input)
    },
  },
}
