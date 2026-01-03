import type { BaseTool } from '../../types'
import type { TransformerFunc } from './base'

export interface TwoWayTransformerTool<TInput, TOutput> extends BaseTool {
  type: 'transformer'
  transformType: 'two-way'
  a: {
    label: string
    convert: TransformerFunc<TInput, TOutput>
  }
  b: {
    label: string
    convert: TransformerFunc<TOutput, TInput>
  }
}
