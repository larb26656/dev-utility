import { createTwoWayTransformerTool } from '@/lib/tools/transformer'

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

export const base64Conversion = createTwoWayTransformerTool<string, string>({
  id: 'base64',
  name: 'Base64',
  description: 'Encode and decode text to/from Base64 format',
  category: 'Converter',
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
})
