import { createGeneratorTool } from '@/lib/tools/generator/factory'

export const uuidConversion = createGeneratorTool<string>({
  id: 'uuid',
  name: 'UUID',
  description: 'Generate UUID v4',
  category: 'Typo',
  generate: () => crypto.randomUUID(),
})
