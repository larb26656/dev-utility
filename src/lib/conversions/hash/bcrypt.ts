import * as bcrypt from 'bcryptjs'
import type { OneWayConversion } from '@/lib/types/one-way'

export const bcryptConversion: OneWayConversion<string, string> = {
  id: 'bcrypt',
  name: 'Bcrypt',
  description: 'Generate bcrypt hash from input text',
  category: 'Hash',
  type: 'one-way',
  convert: (input) => bcrypt.hashSync(input, 10),
}
