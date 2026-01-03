import type {
  NWayTransformerTool,
  OneWayTransformerTool,
  TwoWayTransformerTool,
} from './types'

export function createOneWayTransformerTool<TInput, TOutput>(
  input: Omit<OneWayTransformerTool<TInput, TOutput>, 'type' | 'transformType'>,
): OneWayTransformerTool<TInput, TOutput> {
  return {
    ...input,
    type: 'transformer',
    transformType: 'one-way',
  }
}

export function createTwoWayTransformerTool<TInput, TOuput>(
  input: Omit<TwoWayTransformerTool<TInput, TOuput>, 'type' | 'transformType'>,
): TwoWayTransformerTool<TInput, TOuput> {
  return {
    ...input,
    type: 'transformer',
    transformType: 'two-way',
  }
}

export function createNWayTransformerTool<
  TFormat extends Record<string, any>,
  TIntermediate,
>(
  input: Omit<
    NWayTransformerTool<TFormat, TIntermediate>,
    'type' | 'transformType' | 'convert'
  >,
): NWayTransformerTool<TFormat, TIntermediate> {
  return {
    ...input,
    type: 'transformer',
    transformType: 'n-way',
    convert: (inputType, outputType, value) => {
      const ir = input.transformers[inputType].toIR(value)
      return input.transformers[outputType].fromIR(ir)
    },
  }
}
