import { createGeneratorTool } from '@/lib/tools/generator/factory'

export const uuidTool = createGeneratorTool<string>({
  id: 'uuid',
  name: 'UUID',
  description: 'Generate UUID v4',
  category: 'Typo',
  generate: () => crypto.randomUUID(),
})
