import type { GeneratorTool } from './types'

export function createGeneratorTool<T>(
  input: Omit<GeneratorTool<T>, 'type'>,
): GeneratorTool<T> {
  return {
    ...input,
    type: 'generator',
  }
}
