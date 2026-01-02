export type TransformerFunc<TInput = unknown, TOutput = unknown> = (
  input: TInput,
) => TOutput
