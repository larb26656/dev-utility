export type ConverterFunc<TInput = unknown, TOutput = unknown> = (
  input: TInput,
) => TOutput
