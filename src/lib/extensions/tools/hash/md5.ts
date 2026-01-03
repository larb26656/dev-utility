import * as crypto from 'crypto-js'
import { createOneWayTransformerTool } from '@/lib/tools/transformer'

export const md5Tool = createOneWayTransformerTool<string, string>({
  id: 'md5',
  name: 'MD5',
  description: 'Generate MD5 hash from input text',
  category: 'Hash',
  convert: (input) => crypto.MD5(input).toString(),
})
