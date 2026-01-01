import { createSuccess, createError } from '../conversion-utils'
import * as crypto from 'crypto-js'
import { ConversionCategory } from '../types'

export const md5HashConversion = {
  id: 'md5-hash',
  name: 'MD5 Hash',
  description: 'Generate MD5 hash of the input text',
  category: ConversionCategory.HASHING,
  inputFormat: 'Plain Text',
  outputFormat: 'MD5 Hash',
  bidirectional: false,
  convert: (input: string) => {
    try {
      if (!input) {
        return createSuccess('')
      }
      const hash = crypto.MD5(input).toString()
      return createSuccess(hash)
    } catch {
      return createError('Failed to generate MD5 hash')
    }
  },
}

export const sha256HashConversion = {
  id: 'sha256-hash',
  name: 'SHA-256 Hash',
  description: 'Generate SHA-256 hash of the input text',
  category: ConversionCategory.HASHING,
  inputFormat: 'Plain Text',
  outputFormat: 'SHA-256 Hash',
  bidirectional: false,
  convert: (input: string) => {
    try {
      if (!input) {
        return createSuccess('')
      }
      const hash = crypto.SHA256(input).toString()
      return createSuccess(hash)
    } catch {
      return createError('Failed to generate SHA-256 hash')
    }
  },
}

export const bcryptHashConversion = {
  id: 'bcrypt-hash',
  name: 'Bcrypt Hash',
  description: 'Generate bcrypt hash with configurable rounds (default: 10)',
  category: ConversionCategory.HASHING,
  inputFormat: 'Plain Text',
  outputFormat: 'Bcrypt Hash',
  bidirectional: false,
  options: {
    rounds: {
      type: 'number',
      default: 10,
      min: 4,
      max: 31,
      description: 'Number of salt rounds (4-31)',
    },
  },
  convert: async (input: string, options?: { rounds?: number }) => {
    try {
      if (!input) {
        return createSuccess('')
      }
      const bcrypt = (await import('bcryptjs')).default
      const rounds = options?.rounds ?? 10
      const saltRounds = Math.min(Math.max(rounds, 4), 31)
      const hash = await bcrypt.hash(input, saltRounds)
      return createSuccess(hash)
    } catch {
      return createError('Failed to generate bcrypt hash')
    }
  },
}
