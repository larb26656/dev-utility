import type { TransformerTool } from '../types'
import type {
  OneWayTransformerTool,
  TransformerInstance,
  TwoWayTransformerTool,
} from './types'
import type { NWayTransformerTool } from './types/n-way'
import type { NWayTransformerInstance } from './types/instance'

function createOneWayInstace<TInput, TOutput>(
  def: OneWayTransformerTool<TInput, TOutput>,
): TransformerInstance {
  return {
    type: 'one-way',
    canSwap: false,
    getInputLabel: () => def.inputLabel ?? 'Input',
    getOutputLabel: () => def.inputLabel ?? 'Output',
    convert: async (input: string) => {
      try {
        const out = await def.convert(input as TInput)
        return String(out)
      } catch (e) {
        throw new Error(e instanceof Error ? e.message : 'Conversion failed')
      }
    },
  }
}

function createTwoWayInstance<TInput, TOutput>(
  def: TwoWayTransformerTool<TInput, TOutput>,
): TransformerInstance {
  let direction: 'forward' | 'backward' = 'forward'

  return {
    type: 'two-way',
    canSwap: true,
    getInputLabel: () => (direction === 'forward' ? def.a.label : def.b.label),
    getOutputLabel: () => (direction === 'forward' ? def.b.label : def.a.label),
    swap: () => (direction = direction === 'forward' ? 'backward' : 'forward'),
    convert: async (input: string) => {
      try {
        const out =
          direction === 'forward'
            ? await def.a.convert(input as TInput)
            : await def.b.convert(input as TOutput)

        return String(out)
      } catch (e) {
        console.error(e)
        throw new Error(e instanceof Error ? e.message : 'Conversion failed')
      }
    },
  }
}

function createNWayInstance<TFormat extends Record<string, any>, TIntermediate>(
  def: NWayTransformerTool<TFormat, TIntermediate>,
): NWayTransformerInstance {
  let direction: 'forward' | 'backward' = 'forward'
  let inputFormat: string | null = null
  let outputFormat: string | null = null

  return {
    type: 'n-way',
    canSwap: true,
    swap: () => (direction = direction === 'forward' ? 'backward' : 'forward'),
    getInputLabel: () =>
      direction === 'forward'
        ? (inputFormat ?? 'Input')
        : (inputFormat ?? 'Output'),
    getOutputLabel: () =>
      direction === 'forward'
        ? (inputFormat ?? 'Ouput')
        : (inputFormat ?? 'Input'),
    convert: async (input: string) => {
      if (inputFormat === null) {
        throw new Error("Input format can't be null")
      }

      if (outputFormat === null) {
        throw new Error("Output format can't be null")
      }

      try {
        const out =
          direction === 'forward'
            ? await def.convert(inputFormat, outputFormat, input as any)
            : await def.convert(outputFormat, inputFormat, input as any)

        return String(out)
      } catch (e) {
        console.error(e)
        throw new Error(e instanceof Error ? e.message : 'Conversion failed')
      }
    },
    getFormats: () => Object.keys(def.transformers),
    getInputFormat: () => inputFormat,
    setInputFormat: (value: string) => (inputFormat = value),
    getOutputFormat: () => outputFormat,
    setOutputFormat: (value: string) => (outputFormat = value),
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
    case 'n-way':
      return createNWayInstance(def)
    default:
      throw new Error('Non transformer tool not support')
  }
}
