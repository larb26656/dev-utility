import type { BaseTool } from '../../types'

export interface IRFormatTransformer<TInput, TIntermediate> {
  toIR: (input: TInput) => TIntermediate
  fromIR: (ir: TIntermediate) => TInput
}

export interface NWayTransformerTool<
  TFormat extends Record<string, any>,
  TIntermediate,
> extends BaseTool {
  type: 'transformer'
  transformType: 'n-way'
  transformers: {
    [K in keyof TFormat]: IRFormatTransformer<TFormat[K], TIntermediate>
  }

  convert: <TInput extends keyof TFormat, TOutput extends keyof TFormat>(
    inputType: TInput,
    outputType: TOutput,
    value: TFormat[TInput],
  ) => TFormat[TOutput]
}

// export interface NWayTransformerTool<TIr, TOutput> extends BaseTool {
//   type: 'transformer'
//   transformType: 'n-way'
//   conversions: Array<IRTransformerTool<TIr, unknown, TOutput>>
//   convert: (label: string) => TOutput
// }
