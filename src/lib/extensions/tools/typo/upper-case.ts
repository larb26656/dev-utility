import { createOneWayTransformerTool } from '@/lib/tools/transformer'

export const upperCaseConversion = createOneWayTransformerTool<string, string>({
  id: 'uppercase',
  name: 'Uppercase',
  description: 'Convert text to uppercase letters',
  category: 'Typo',
  convert: (input) => input.toUpperCase(),
})
