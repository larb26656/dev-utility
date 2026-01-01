import type { NWayConversion } from './n-way'
import type { OneWayConversion } from './one-way'
import type { TwoWayConversion } from './two-way'

export type AnyOneWayConversion = OneWayConversion<any, any>
export type AnyTwoWayConversion = TwoWayConversion<any, any>
export type AnyNWayConversion = NWayConversion<any>

export type Conversion =
  | OneWayConversion<any, any>
  | TwoWayConversion<any, any>
  | NWayConversion<any>
