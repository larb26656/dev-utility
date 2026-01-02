import type { OneWayTransformerTool, TwoWayTransformerTool } from './types'

export function createOneWayTransformerTool<TA, TB>(
  input: Omit<OneWayTransformerTool<TA, TB>, 'type' | 'transformType'>,
): OneWayTransformerTool<TA, TB> {
  return {
    ...input,
    type: 'transformer',
    transformType: 'one-way',
  }
}

export function createTwoWayTransformerTool<TA, TB>(
  input: Omit<TwoWayTransformerTool<TA, TB>, 'type' | 'transformType'>,
): TwoWayTransformerTool<TA, TB> {
  return {
    ...input,
    type: 'transformer',
    transformType: 'two-way',
  }
}
