import type { BaseConversion, ConverterFunc } from './converter'

export interface TwoWayConversion<TA, TB> extends BaseConversion {
  type: 'two-way'
  a: {
    label: string
    convert: ConverterFunc<TA, TB>
  }
  b: {
    label: string
    convert: ConverterFunc<TB, TA>
  }
}
