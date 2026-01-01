import { createSuccess, createError } from '../conversion-utils'
import { jwtDecode } from 'jwt-decode'
import { ConversionCategory } from '../types'

export const jwtDecodeConversion = {
  id: 'jwt-decode',
  name: 'JWT Decode',
  description: 'Decode JWT token to reveal header and payload',
  category: ConversionCategory.TEXT_ENCODING,
  inputFormat: 'JWT Token',
  outputFormat: 'JSON',
  bidirectional: true,
  reverseConversionId: 'jwt-encode',
  convert: (input: string) => {
    try {
      if (!input) {
        return createSuccess('')
      }
      const decoded = jwtDecode(input)
      const result = JSON.stringify(decoded, null, 2)
      return createSuccess(result)
    } catch {
      return createError('Invalid JWT token')
    }
  },
}

export const jwtEncodeConversion = {
  id: 'jwt-encode',
  name: 'JWT Encode',
  description:
    'Encode JSON payload to JWT (header: {"alg":"HS256","typ":"JWT"})',
  category: ConversionCategory.TEXT_ENCODING,
  inputFormat: 'JSON',
  outputFormat: 'JWT Token',
  bidirectional: true,
  reverseConversionId: 'jwt-decode',
  convert: (input: string) => {
    try {
      if (!input) {
        return createSuccess('')
      }
      const payload = JSON.parse(input)
      const header = { alg: 'HS256', typ: 'JWT' }

      const encode = (obj: Record<string, unknown>) => {
        return btoa(JSON.stringify(obj))
          .replace(/=/g, '')
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
      }

      const headerEncoded = encode(header)
      const payloadEncoded = encode(payload)
      const signature = `${headerEncoded}.${payloadEncoded}`

      return createSuccess(signature)
    } catch {
      return createError('Invalid JSON input')
    }
  },
}
