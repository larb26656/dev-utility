import * as crypto from 'crypto-js'
import { createOneWayTransformerTool } from '@/lib/tools/transformer'

export const sha256Conversion = createOneWayTransformerTool<string, string>({
  id: 'sha256',
  name: 'SHA-256',
  description: 'Generate SHA-256 hash from input text',
  category: 'Hash',
  convert: (input) => crypto.SHA256(input).toString(),
})
