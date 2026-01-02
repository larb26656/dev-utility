import type { GeneratorTool } from './generator'
import type {
  NWayTransformerTool,
  OneWayTransformerTool,
  TwoWayTransformerTool,
} from './transformer'

export type ToolCategory = 'Hash' | 'Typo' | 'Converter'

// export interface Tool {
//   id: string
//   name: string
//   description?: string
//   type: 'transformer' | 'generator'
//   category: ToolCategory
// }

export interface BaseTool {
  id: string
  name: string
  description?: string
  category: ToolCategory
}

export type TransformerTool =
  | OneWayTransformerTool<any, any>
  | TwoWayTransformerTool<any, any>
  | NWayTransformerTool<any>

export type Tool = GeneratorTool<any> | TransformerTool
