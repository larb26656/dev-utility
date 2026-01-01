import type { GeneratorConversion } from './generator'
import type { NWayConversion } from './n-way'
import type { OneWayConversion } from './one-way'
import type { TwoWayConversion } from './two-way'

export type AnyGeneratorConversion = GeneratorConversion<any>
export type AnyOneWayConversion = OneWayConversion<any, any>
export type AnyTwoWayConversion = TwoWayConversion<any, any>
export type AnyNWayConversion = NWayConversion<any>

export type Conversion =
  | GeneratorConversion<any>
  | OneWayConversion<any, any>
  | TwoWayConversion<any, any>
  | NWayConversion<any>
