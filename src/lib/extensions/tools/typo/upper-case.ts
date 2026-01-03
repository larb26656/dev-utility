import { createOneWayTransformerTool } from '@/lib/tools/transformer'

export const upperCaseTool = createOneWayTransformerTool<string, string>({
  id: 'uppercase',
  name: 'Uppercase',
  description: 'Convert text to uppercase letters',
  category: 'Typo',
  convert: (input) => input.toUpperCase(),
})
