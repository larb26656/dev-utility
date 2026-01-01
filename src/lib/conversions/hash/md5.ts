import type { OneWayConversion } from '@/lib/types/one-way'
import * as crypto from 'crypto-js'

export const md5Conversion: OneWayConversion<string, string> = {
  id: 'md5',
  name: 'MD5',
  category: 'hash',
  type: 'one-way',
  label: 'MD5',
  convert: (input) => crypto.MD5(input).toString(),
}
