import { jwtDecode } from 'jwt-decode'
import { createOneWayTransformerTool } from '@/lib/tools/transformer'

interface JwtParts {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
  isExpired: boolean
  expiresAt: string | null
}

export const jwtDecoderTool = createOneWayTransformerTool<string, string>({
  id: 'jwt-decoder',
  name: 'JWT Decoder',
  description: 'Decode JWT token to view header, payload, and signature',
  category: 'Converter',
  convert: (input: string) => {
    const trimmed = input.trim()
    const parts = trimmed.split('.')

    if (parts.length !== 3) {
      throw new Error('Invalid JWT format. Expected 3 parts separated by dots.')
    }

    const signature = parts[2]

    let header: Record<string, unknown>
    let payload: Record<string, unknown>

    try {
      header = jwtDecode(trimmed, { header: true })
    } catch {
      throw new Error('Failed to decode JWT header')
    }

    try {
      payload = jwtDecode(trimmed)
    } catch {
      throw new Error('Failed to decode JWT payload')
    }

    const now = Math.floor(Date.now() / 1000)
    let isExpired = false
    let expiresAt: string | null = null

    if (typeof payload.exp === 'number') {
      isExpired = payload.exp < now
      expiresAt = new Date(payload.exp * 1000).toISOString()
    }

    const result: JwtParts = {
      header,
      payload,
      signature,
      isExpired,
      expiresAt,
    }

    return JSON.stringify(result, null, 2)
  },
})