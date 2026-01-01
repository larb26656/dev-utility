export type ConversionResult<T = string> = {
  success: true;
  data: T;
};

export type ConversionError = {
  success: false;
  error: string;
};

export type ConversionOutput<T = string> = ConversionResult<T> | ConversionError;

export interface ConversionFunction<TInput = string, TOutput = string> {
  (input: TInput): ConversionOutput<TOutput> | Promise<ConversionOutput<TOutput>>;
}

export interface ConversionOptions {
  [key: string]: unknown;
}

export interface Conversion<TInput = string, TOutput = string> {
  id: string;
  name: string;
  description: string;
  category: ConversionCategory;
  inputFormat: string;
  outputFormat: string;
  bidirectional: boolean;
  reverseConversionId?: string;
  convert: ConversionFunction<TInput, TOutput>;
  options?: ConversionOptions;
}

export enum ConversionCategory {
  TEXT_ENCODING = 'Text & Encoding',
  HASHING = 'Hashing',
  STRUCTURED_DATA = 'Structured Data',
  CRYPTO = 'Cryptography',
}
