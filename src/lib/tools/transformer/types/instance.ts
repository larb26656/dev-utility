interface TransformerInstanceBase {
  convert: (input: string) => Promise<string>
  getInputLabel: () => string
  getOutputLabel: () => string
}

export interface NonSwappableTransformerInstance extends TransformerInstanceBase {
  type: 'one-way'
  canSwap: false
}

export interface SwappableTransformerInstance extends TransformerInstanceBase {
  type: 'two-way'
  canSwap: true
  swap: () => void
}

export interface NWayTransformerInstance extends TransformerInstanceBase {
  type: 'n-way'
  canSwap: true
  swap: () => void
  getFormats: () => Array<string>
  getInputFormat: () => string | null
  setInputFormat: (value: string) => void
  getOutputFormat: () => string | null
  setOutputFormat: (value: string) => void
}

export type TransformerInstance =
  | NonSwappableTransformerInstance
  | SwappableTransformerInstance
  | NWayTransformerInstance
