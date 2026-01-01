import type { ConverterFunc } from './converter'

export interface OneWayConversion<TA, TB> {
  type: 'one-way'
  label: string
  convert: ConverterFunc<TA, TB>
}
