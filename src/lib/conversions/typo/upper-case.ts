import type { OneWayConversion } from '@/lib/types/one-way'

export const upperCaseConversion: OneWayConversion<string, string> = {
  id: 'uppercase',
  name: 'Uppercase',
  description: 'Convert text to uppercase letters',
  category: 'Typo',
  type: 'one-way',
  convert: (input) => input.toUpperCase(),
}
