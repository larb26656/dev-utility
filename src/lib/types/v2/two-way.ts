import type { ConverterFunc } from './converter'

export interface TwoWayConversion<TA, TB> {
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
