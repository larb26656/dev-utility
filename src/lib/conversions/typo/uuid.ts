import type { GeneratorConversion } from '@/lib/types/generator'

export const uuidConversion: GeneratorConversion<string> = {
  id: 'uuid',
  name: 'UUID',
  description: 'Generate UUID v4',
  category: 'Typo',
  type: 'generator',
  generate: () => crypto.randomUUID(),
}
