import type { BaseTool } from '../types'

export interface GeneratorTool<T> extends BaseTool {
  type: 'generator'
  generate(): T | Promise<T>
}

export interface GeneratorInstance {
  generate(): Promise<string>
  getOutputLabel(): string
}
