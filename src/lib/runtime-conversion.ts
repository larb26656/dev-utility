import type {
  NWayConversion,
  OneWayConversion,
  TwoWayConversion,
} from './types'

interface RuntimeConversionBase {
  id: string
  label: string
  convert(input: string): Promise<string>

  getInputLabel(): string
  getOutputLabel(): string
}

export interface NonSwappableRuntimeConversion extends RuntimeConversionBase {
  canSwap: false
}

export interface SwappableRuntimeConversion extends RuntimeConversionBase {
  canSwap: true
  swap(): void
}

export type RuntimeConversion =
  | NonSwappableRuntimeConversion
  | SwappableRuntimeConversion

function createOneWayRuntime<TIn, TOut>(
  def: OneWayConversion<TIn, TOut>,
): RuntimeConversion {
  return {
    id: def.id,
    label: def.label,
    canSwap: false,
    getInputLabel: () => 'Input',
    getOutputLabel: () => 'Output',
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

function createTwoWayRuntime<TA, TB>(
  def: TwoWayConversion<TA, TB>,
): RuntimeConversion {
  let direction: 'forward' | 'backward' = 'forward'

  return {
    id: def.id,
    label: def.label,
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

export function createRuntimeConversion(
  def:
    | OneWayConversion<any, any>
    | TwoWayConversion<any, any>
    | NWayConversion<any>,
): RuntimeConversion {
  switch (def.type) {
    case 'one-way':
      return createOneWayRuntime(def)
    case 'two-way':
      return createTwoWayRuntime(def)
    case 'n-way':
      throw new Error('Unsupport yet')
      break
  }
}
