import type { GeneratorTool } from './generator'
import type {
  NWayTransformerTool,
  OneWayTransformerTool,
  TwoWayTransformerTool,
} from './transformer'
import type { FreeStyleTool } from './freestyle'
import type { SnippetTool } from './snippet'

export type ToolCategory =
  | 'Hash'
  | 'Typo'
  | 'Converter'
  | 'Snippet'
  | 'Network'
  | 'Productivity'

export const CATEGORY_ORDER = [
  'Hash',
  'Typo',
  'Network',
  'Converter',
  'Productivity',
  'Snippet',
] as const satisfies ReadonlyArray<ToolCategory>

export interface BaseTool {
  id: string
  name: string
  description?: string
  category: ToolCategory
}

export type TransformerTool =
  | OneWayTransformerTool<any, any>
  | TwoWayTransformerTool<any, any>
  | NWayTransformerTool<any, any>

export type Tool = GeneratorTool<any> | TransformerTool | FreeStyleTool | SnippetTool
