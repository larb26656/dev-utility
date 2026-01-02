import type { TransformerTool } from '../types'
import type {
  OneWayTransformerTool,
  TransformerInstance,
  TwoWayTransformerTool,
} from './types'

function createOneWayInstace<TIn, TOut>(
  def: OneWayTransformerTool<TIn, TOut>,
): TransformerInstance {
  return {
    canSwap: false,
    getInputLabel: () => def.inputLabel ?? 'Input',
    getOutputLabel: () => def.inputLabel ?? 'Output',
    convert: async (input: string) => {
      try {
        const out = await def.convert(input as TIn)
        return String(out)
      } catch (e) {
        throw new Error(e instanceof Error ? e.message : 'Conversion failed')
      }
    },
  }
}

function createTwoWayInstance<TA, TB>(
  def: TwoWayTransformerTool<TA, TB>,
): TransformerInstance {
  let direction: 'forward' | 'backward' = 'forward'

  return {
    canSwap: true,
    getInputLabel: () => (direction === 'forward' ? def.a.label : def.b.label),
    getOutputLabel: () => (direction === 'forward' ? def.b.label : def.a.label),
    swap: () => (direction = direction === 'forward' ? 'backward' : 'forward'),
    convert: async (input: string) => {
      try {
        const out =
          direction === 'forward'
            ? await def.a.convert(input as TA)
            : await def.b.convert(input as TB)

        return String(out)
      } catch (e) {
        console.error(e)
        throw new Error(e instanceof Error ? e.message : 'Conversion failed')
      }
    },
  }
}

export function createTransformerInstance(
  def: TransformerTool,
): TransformerInstance {
  switch (def.transformType) {
    case 'one-way':
      return createOneWayInstace(def)
    case 'two-way':
      return createTwoWayInstance(def)
    default:
      throw new Error('Non transformer tool not support')
  }
}
