import type { BaseConversion, ConverterFunc } from './converter'

export interface OneWayConversion<TA, TB> extends BaseConversion {
  type: 'one-way'
  label: string
  convert: ConverterFunc<TA, TB>
}
