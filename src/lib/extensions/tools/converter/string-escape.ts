import { createTwoWayTransformerTool } from '@/lib/tools/transformer'

export function escapeString(input: string): string {
  return JSON.stringify(input).slice(1, -1)
}

export function unescapeString(input: string): string {
  return JSON.parse(`"${input}"`)
}

export const stringEscapeTool = createTwoWayTransformerTool<string, string>({
  id: 'string-escape',
  name: 'String Escape',
  description: 'Escape and unescape string literals (quotes, newlines, tabs, backslashes)',
  category: 'Converter',
  a: {
    label: 'Raw String',
    convert: (input) => escapeString(input),
  },
  b: {
    label: 'Escaped String',
    convert: (input) => unescapeString(input),
  },
})
