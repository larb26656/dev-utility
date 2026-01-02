import type { BaseTool } from '../../types'
import type { TransformerFunc } from './base'

export interface TwoWayTransformerTool<TA, TB> extends BaseTool {
  type: 'transformer'
  transformType: 'two-way'
  a: {
    label: string
    convert: TransformerFunc<TA, TB>
  }
  b: {
    label: string
    convert: TransformerFunc<TB, TA>
  }
}
