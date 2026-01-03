import type { GeneratorInstance, GeneratorTool } from './types'

export function createGeneratorInstance<T>(
  tool: GeneratorTool<T>,
): GeneratorInstance {
  return {
    generate: async () => {
      const value = await tool.generate()
      return String(value)
    },
    getOutputLabel: () => {
      return tool.name
    },
  }
}
