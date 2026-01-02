import type { BaseTool } from '../../types'
import type { TransformerFunc } from './base'

export interface IRTransformerTool<TIr, TValue> {
  label: string
  irToValue: TransformerFunc<TIr, TValue>
  valueToIr: TransformerFunc<TValue, TIr>
}

export interface NWayTransformerTool<TIr> extends BaseTool {
  type: 'transformer'
  transformType: 'n-way'
  conversions: Array<IRTransformerTool<TIr, unknown>>
}
