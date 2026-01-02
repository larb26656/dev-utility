import * as bcrypt from 'bcryptjs'
import { createOneWayTransformerTool } from '@/lib/tools/transformer'

export const bcryptConversion = createOneWayTransformerTool<string, string>({
  id: 'bcrypt',
  name: 'Bcrypt',
  description: 'Generate bcrypt hash from input text',
  category: 'Hash',
  convert: (input) => bcrypt.hashSync(input, 10),
})
