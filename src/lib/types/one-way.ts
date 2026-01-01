import type { BaseConversion, ConverterFunc } from './converter'

export interface OneWayConversion<TA, TB> extends BaseConversion {
  type: 'one-way'
  convert: ConverterFunc<TA, TB>
}
