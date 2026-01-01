import * as crypto from 'crypto-js'
import type { OneWayConversion } from '@/lib/types/one-way'

export const sha256Conversion: OneWayConversion<string, string> = {
  id: 'sha256',
  name: 'SHA-256',
  description: 'Generate SHA-256 hash from input text',
  category: 'Hash',
  type: 'one-way',
  convert: (input) => crypto.SHA256(input).toString(),
}
