import type { ConverterFunc } from './converter'

export interface IRConversion<TIr, TValue> {
  label: string
  irToValue: ConverterFunc<TIr, TValue>
  valueToIr: ConverterFunc<TValue, TIr>
}

interface NWayConversion<TIr> {
  type: 'n-way'
  conversions: IRConversion<TIr, unknown>[]
}
