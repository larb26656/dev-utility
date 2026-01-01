export type ConverterFunc<TInput = unknown, TOutput = unknown> = (
  input: TInput,
) => TOutput

export type ConversionCategory = 'Hash' | 'Typo' | 'Converter'
export interface BaseConversion {
  id: string
  name: string
  type: 'one-way' | 'two-way' | 'n-way'
  label: string
  category: ConversionCategory
}
