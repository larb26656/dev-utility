import type { ConversionError, ConversionOutput } from './types'

export function createError(message: string): ConversionError {
  return {
    success: false,
    error: message,
  }
}

export function createSuccess<T>(data: T): ConversionOutput<T> {
  return {
    success: true,
    data,
  }
}

export function wrapConversion<TInput, TOutput>(
  fn: (
    input: TInput,
  ) => ConversionOutput<TOutput> | Promise<ConversionOutput<TOutput>>,
) {
  return async (input: TInput): Promise<ConversionOutput<TOutput>> => {
    try {
      const result = fn(input)
      return result instanceof Promise ? await result : result
    } catch (error) {
      return createError(
        error instanceof Error
          ? error.message
          : 'An unknown error occurred during conversion',
      )
    }
  }
}
