import { createNWayTransformerTool } from '@/lib/tools/transformer'

type CaseStyle = 'camelCase' | 'snake_case' | 'kebab-case' | 'PascalCase'

function toWords(str: string): Array<string> {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_\s]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
}

function fromWords(words: Array<string>, style: CaseStyle): string {
  if (words.length === 0) return ''

  switch (style) {
    case 'camelCase':
      return words
        .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
        .join('')
    case 'snake_case':
      return words.map((w) => w.toLowerCase()).join('_')
    case 'kebab-case':
      return words.map((w) => w.toLowerCase()).join('-')
    case 'PascalCase':
      return words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('')
    default:
      return words.join('')
  }
}

const styles: Array<CaseStyle> = ['camelCase', 'snake_case', 'kebab-case', 'PascalCase']

export const caseConverterTool = createNWayTransformerTool<
  Record<CaseStyle, string>,
  Array<string>
>({
  id: 'case-converter',
  name: 'Case Converter',
  description: 'Convert text between camelCase, snake_case, kebab-case, and PascalCase',
  category: 'Converter',
  transformers: Object.fromEntries(
    styles.map((style) => [
      style,
      {
        toIR: toWords,
        fromIR: (words) => fromWords(words, style),
      },
    ])
  ) as Record<CaseStyle, { toIR: (input: string) => Array<string>; fromIR: (ir: Array<string>) => string }>,
})