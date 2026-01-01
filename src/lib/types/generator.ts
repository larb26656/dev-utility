import type { BaseConversion } from './converter'

export interface GeneratorConversion<TOutput = unknown> extends BaseConversion {
  type: 'generator'
  generate: () => TOutput
}
