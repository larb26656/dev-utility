import { createSuccess, createError } from '../conversion-utils';
import { ConversionCategory } from '@/types';

const THAI_TO_ENGLISH: Record<string, string> = {
  '\u0E51': '1',
  '\u0E52': '2',
  '\u0E53': '3',
  '\u0E54': '4',
  '\u0E55': '5',
  '\u0E56': '6',
  '\u0E57': '7',
  '\u0E58': '8',
  '\u0E59': '9',
  '\u0E50': '0',
  '-': '-',
  '=': '=',
  '\u0E20': 'q',
  '\u0E16': 'w',
  '\u0E38': 'e',
  '\u0E36': 'r',
  '\u0E04': 't',
  '\u0E15': 'y',
  '\u0E08': 'u',
  '\u0E02': 'i',
  '\u0E0A': 'o',
  '\u0E46': 'p',
  '\u0E44': '[',
  '\u0E33': ']',
  '\u0E1E': 'a',
  '\u0E30': 's',
  '\u0E31': 'd',
  '\u0E34': 'f',
  '\u0E23': 'g',
  '\u0E19': 'h',
  '\u0E22': 'j',
  '\u0E1A': 'k',
  '\u0E25': 'l',
  '\u0E03': ';',
  '\u0E1F': "'",
  '\u0E2B': 'z',
  '\u0E01': 'x',
  '\u0E14': 'c',
  '\u0E40': 'v',
  '\u0E49': 'b',
  '\u0E48': 'n',
  '\u0E32': 'm',
  '\u0E2A': ',',
  '\u0E27': '.',
  '\u0E07': '/',
};

const ENGLISH_TO_THAI: Record<string, string> = {
  '1': '\u0E51',
  '2': '\u0E52',
  '3': '\u0E53',
  '4': '\u0E54',
  '5': '\u0E55',
  '6': '\u0E56',
  '7': '\u0E57',
  '8': '\u0E58',
  '9': '\u0E59',
  '0': '\u0E50',
  q: '\u0E20',
  w: '\u0E16',
  e: '\u0E38',
  r: '\u0E36',
  t: '\u0E04',
  y: '\u0E15',
  u: '\u0E08',
  i: '\u0E02',
  o: '\u0E0A',
  p: '\u0E46',
  '[': '\u0E44',
  ']': '\u0E33',
  a: '\u0E1E',
  s: '\u0E30',
  d: '\u0E31',
  f: '\u0E34',
  g: '\u0E23',
  h: '\u0E19',
  j: '\u0E22',
  k: '\u0E1A',
  l: '\u0E25',
  ';': '\u0E03',
  "'": '\u0E1F',
  z: '\u0E2B',
  x: '\u0E01',
  c: '\u0E14',
  v: '\u0E40',
  b: '\u0E49',
  n: '\u0E48',
  m: '\u0E32',
  ',': '\u0E2A',
  '.': '\u0E27',
  '/': '\u0E07',
};

export const thaiToEnglishConversion = {
  id: 'thai-to-english',
  name: 'Thai to English',
  description: 'Convert Thai keyboard layout to English keyboard layout',
  category: ConversionCategory.TEXT_ENCODING,
  inputFormat: 'Thai Text',
  outputFormat: 'English Text',
  bidirectional: true,
  reverseConversionId: 'english-to-thai',
  convert: (input: string) => {
    try {
      let result = '';
      for (let i = 0; i < input.length; i++) {
        result += THAI_TO_ENGLISH[input[i]] || input[i];
      }
      return createSuccess(result);
    } catch {
      return createError('Failed to convert Thai to English');
    }
  },
};

export const englishToThaiConversion = {
  id: 'english-to-thai',
  name: 'English to Thai',
  description: 'Convert English keyboard layout to Thai keyboard layout',
  category: ConversionCategory.TEXT_ENCODING,
  inputFormat: 'English Text',
  outputFormat: 'Thai Text',
  bidirectional: true,
  reverseConversionId: 'thai-to-english',
  convert: (input: string) => {
    try {
      let result = '';
      for (let i = 0; i < input.length; i++) {
        result += ENGLISH_TO_THAI[input[i]] || input[i];
      }
      return createSuccess(result);
    } catch {
      return createError('Failed to convert English to Thai');
    }
  },
};
