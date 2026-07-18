import { createTwoWayTransformerTool } from '@/lib/tools/transformer'

export function urlEncode(input: string): string {
  return encodeURIComponent(input)
}

export function urlDecode(input: string): string {
  return decodeURIComponent(input)
}

export const urlEscapeTool = createTwoWayTransformerTool<string, string>({
  id: 'url-escape',
  name: 'URL Escape',
  description: 'Encode and decode URL components',
  category: 'Converter',
  a: {
    label: 'Plain Text',
    convert: (input) => urlEncode(input),
  },
  b: {
    label: 'URL Encoded',
    convert: (input) => urlDecode(input),
  },
})
