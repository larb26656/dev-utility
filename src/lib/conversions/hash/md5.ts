import type { OneWayConversion } from '@/lib/types/one-way'
import * as crypto from 'crypto-js'

export const md5Conversion: OneWayConversion<string, string> = {
  id: 'md5',
  name: 'MD5',
  description: 'Generate MD5 hash from input text',
  category: 'Hash',
  type: 'one-way',
  convert: (input) => crypto.MD5(input).toString(),
}
