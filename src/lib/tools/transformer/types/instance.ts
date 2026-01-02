interface TransformerInstanceBase {
  convert(input: string): Promise<string>
  getInputLabel(): string
  getOutputLabel(): string
}

export interface NonSwappableTransformerInstance extends TransformerInstanceBase {
  canSwap: false
}

export interface SwappableTransformerInstance extends TransformerInstanceBase {
  canSwap: true
  swap(): void
}

export type TransformerInstance =
  | NonSwappableTransformerInstance
  | SwappableTransformerInstance
