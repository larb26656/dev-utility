import type { OneWayConversion } from '@/lib/types/one-way'

export const upperCaseConversion: OneWayConversion<string, string> = {
  id: 'uppercase',
  name: 'Uppercase',
  category: 'typo',
  type: 'one-way',
  label: 'Uppercase',
  convert: (input) => input.toUpperCase(),
}
