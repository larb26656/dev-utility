import type { BaseTool } from '../../types'
import type { TransformerFunc } from './base'

export interface OneWayTransformerTool<TInput, TOutput> extends BaseTool {
  type: 'transformer'
  transformType: 'one-way'
  inputLabel?: string
  outputLabel?: string
  convert: TransformerFunc<TInput, TOutput>
}
