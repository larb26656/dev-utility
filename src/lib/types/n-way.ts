import type { BaseConversion, ConverterFunc } from './converter'

export interface IRConversion<TIr, TValue> {
  label: string
  irToValue: ConverterFunc<TIr, TValue>
  valueToIr: ConverterFunc<TValue, TIr>
}

export interface NWayConversion<TIr> extends BaseConversion {
  type: 'n-way'
  conversions: IRConversion<TIr, unknown>[]
}
