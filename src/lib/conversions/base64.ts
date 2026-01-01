import { createSuccess, createError } from '../conversion-utils';
import { ConversionCategory } from '@/types';

export const base64EncodeConversion = {
  id: 'base64-encode',
  name: 'Base64 Encode',
  description: 'Encode text to Base64 format',
  category: ConversionCategory.TEXT_ENCODING,
  inputFormat: 'Plain Text',
  outputFormat: 'Base64',
  bidirectional: true,
  reverseConversionId: 'base64-decode',
  convert: (input: string) => {
    try {
      if (!input) {
        return createSuccess('');
      }
      const encoded = btoa(unescape(encodeURIComponent(input)));
      return createSuccess(encoded);
    } catch {
      return createError('Failed to encode to Base64');
    }
  },
};

export const base64DecodeConversion = {
  id: 'base64-decode',
  name: 'Base64 Decode',
  description: 'Decode Base64 text to plain text',
  category: ConversionCategory.TEXT_ENCODING,
  inputFormat: 'Base64',
  outputFormat: 'Plain Text',
  bidirectional: true,
  reverseConversionId: 'base64-encode',
  convert: (input: string) => {
    try {
      if (!input) {
        return createSuccess('');
      }
      const decoded = decodeURIComponent(escape(atob(input)));
      return createSuccess(decoded);
    } catch {
      return createError('Invalid Base64 input');
    }
  },
};
