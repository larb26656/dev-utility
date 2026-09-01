/**
 * IPv4 CIDR parsing and computation utilities.
 *
 * All functions are pure and have no React or DOM dependencies so they
 * can be exercised by Vitest in a jsdom environment.
 */

export type Ipv4Type =
  | 'Private'
  | 'Public'
  | 'Loopback'
  | 'Link-Local'
  | 'Multicast'
  | 'Reserved'
  | 'This Network'
  | 'Documentation'

export type Ipv4Class = 'A' | 'B' | 'C' | 'D' | 'E'

export type Ipv4Octets = [number, number, number, number]

export interface Ipv4CidrInfo {
  version: 4
  input: string
  cidr: number
  octets: Ipv4Octets
  networkInt: number
  broadcastInt: number
  network: string
  broadcast: string
  subnetMask: string
  wildcardMask: string
  firstUsable: string | null
  lastUsable: string | null
  totalAddresses: number
  usableHosts: number
  ipClass: Ipv4Class
  type: Ipv4Type
  binary: {
    network: string
    host: string
    full: string
    octets: Array<{ network: string; host: string }>
  }
}

export type ParseIpv4Result =
  | { ok: true; info: Ipv4CidrInfo }
  | { ok: false; error: string }

/* --------------------------------------------------------------------------
 * Primitive helpers
 * ------------------------------------------------------------------------ */

const OCTET_RE = /^(0|[1-9]\d{0,2})$/

export function isValidOctet(value: string): boolean {
  if (!OCTET_RE.test(value)) return false
  const n = Number(value)
  return n >= 0 && n <= 255
}

export function ipv4ToInt(octets: Ipv4Octets): number {
  return ((octets[0] << 24) >>> 0) + (octets[1] << 16) + (octets[2] << 8) + octets[3]
}

export function intToIpv4(value: number): Ipv4Octets {
  const v = value >>> 0
  return [(v >>> 24) & 0xff, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff]
}

export function cidrToMaskInt(prefix: number): number {
  if (prefix === 0) return 0
  return ((0xffffffff << (32 - prefix)) >>> 0)
}

export function maskIntToOctets(mask: number): Ipv4Octets {
  return intToIpv4(mask)
}

export function wildcardIntToOctets(mask: number): Ipv4Octets {
  return intToIpv4((~mask) >>> 0)
}

export function octetsToDotted(octets: Ipv4Octets): string {
  return octets.join('.')
}

export function octetToBinary(value: number): string {
  return value.toString(2).padStart(8, '0')
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-US')
}

/* --------------------------------------------------------------------------
 * Classification
 * ------------------------------------------------------------------------ */

export function classifyIpv4Class(firstOctet: number): Ipv4Class {
  if (firstOctet <= 127) return 'A'
  if (firstOctet <= 191) return 'B'
  if (firstOctet <= 223) return 'C'
  if (firstOctet <= 239) return 'D'
  return 'E'
}

export function classifyIpv4Type(networkInt: number, cidr: number): Ipv4Type {
  // Specific carve-outs before the generic Private / Public fallthrough.
  // Each block is described in octets for readability, then compared against
  // the network integer at the relevant prefix length.
  void cidr
  const blocks: Array<{
    base: Ipv4Octets
    prefix: number
    type: Ipv4Type
  }> = [
    { base: [0, 0, 0, 0], prefix: 8, type: 'This Network' },
    { base: [10, 0, 0, 0], prefix: 8, type: 'Private' },
    { base: [127, 0, 0, 0], prefix: 8, type: 'Loopback' },
    { base: [169, 254, 0, 0], prefix: 16, type: 'Link-Local' },
    { base: [172, 16, 0, 0], prefix: 12, type: 'Private' },
    { base: [192, 0, 2, 0], prefix: 24, type: 'Documentation' },
    { base: [192, 168, 0, 0], prefix: 16, type: 'Private' },
    { base: [198, 51, 100, 0], prefix: 24, type: 'Documentation' },
    { base: [203, 0, 113, 0], prefix: 24, type: 'Documentation' },
    { base: [224, 0, 0, 0], prefix: 4, type: 'Multicast' },
    { base: [240, 0, 0, 0], prefix: 4, type: 'Reserved' },
  ]

  for (const block of blocks) {
    const mask = cidrToMaskInt(block.prefix)
    if ((networkInt & mask) === (ipv4ToInt(block.base) & mask)) {
      return block.type
    }
  }

  return 'Public'
}

/* --------------------------------------------------------------------------
 * Binary visualization
 * ------------------------------------------------------------------------ */

function buildBinary(networkInt: number, cidr: number): Ipv4CidrInfo['binary'] {
  const octets = intToIpv4(networkInt)
  const octetBinarys = octets.map(octetToBinary)

  // Decide where the network/host boundary falls at the octet level.
  // Anything before `splitOctet` is fully network, anything at or after is
  // split or fully host.
  const splitOctet = Math.floor(cidr / 8)
  const splitBit = cidr % 8

  const octetParts: Array<{ network: string; host: string }> = octetBinarys.map(
    (bits, idx) => {
      if (idx < splitOctet) {
        return { network: bits, host: '' }
      }
      if (idx === splitOctet) {
        return {
          network: bits.slice(0, splitBit),
          host: bits.slice(splitBit),
        }
      }
      return { network: '', host: bits }
    },
  )

  const network = octetParts.map((p) => p.network).join('.')
  const host = octetParts.map((p) => p.host).join('.')

  return {
    network,
    host,
    full: octetBinarys.join('.'),
    octets: octetParts,
  }
}

/* --------------------------------------------------------------------------
 * Public API
 * ------------------------------------------------------------------------ */

export function parseIpv4Cidr(input: string): ParseIpv4Result {
  const trimmed = input.trim()
  if (!trimmed) {
    return { ok: false, error: 'CIDR is required' }
  }

  const slashIndex = trimmed.indexOf('/')
  if (slashIndex === -1) {
    return { ok: false, error: 'Missing prefix length (e.g. /24)' }
  }

  const addressPart = trimmed.slice(0, slashIndex)
  const prefixPart = trimmed.slice(slashIndex + 1)

  const octetStrings = addressPart.split('.')
  if (octetStrings.length !== 4) {
    return { ok: false, error: 'IPv4 address must have 4 octets' }
  }
  if (!octetStrings.every(isValidOctet)) {
    return { ok: false, error: 'Invalid IPv4 octet (each must be 0-255)' }
  }

  const octets = octetStrings.map(Number) as Ipv4Octets

  if (!/^\d{1,2}$/.test(prefixPart)) {
    return { ok: false, error: 'Prefix length must be a number between 0 and 32' }
  }
  const cidr = Number(prefixPart)
  if (cidr < 0 || cidr > 32) {
    return { ok: false, error: 'Prefix length must be between 0 and 32' }
  }

  const maskInt = cidrToMaskInt(cidr)
  const wildcardInt = (~maskInt) >>> 0
  const inputInt = ipv4ToInt(octets)
  const networkInt = (inputInt & maskInt) >>> 0
  const broadcastInt = (networkInt | wildcardInt) >>> 0

  const networkOctets = intToIpv4(networkInt)
  const broadcastOctets = intToIpv4(broadcastInt)
  const maskOctets = maskIntToOctets(maskInt)
  const wildcardOctets = wildcardIntToOctets(maskInt)

  const totalAddresses = cidr === 32 ? 1 : Math.pow(2, 32 - cidr)
  let usableHosts: number
  let firstUsable: string | null
  let lastUsable: string | null

  if (cidr === 32) {
    usableHosts = 1
    firstUsable = null
    lastUsable = null
  } else if (cidr === 31) {
    // RFC 3021: both addresses usable on point-to-point links.
    usableHosts = 2
    firstUsable = octetsToDotted(networkOctets)
    lastUsable = octetsToDotted(broadcastOctets)
  } else {
    usableHosts = Math.max(0, totalAddresses - 2)
    firstUsable = octetsToDotted(intToIpv4(networkInt + 1))
    lastUsable = octetsToDotted(intToIpv4(broadcastInt - 1))
  }

  const ipClass = classifyIpv4Class(octets[0])
  const type = classifyIpv4Type(networkInt, cidr)
  const binary = buildBinary(networkInt, cidr)

  return {
    ok: true,
    info: {
      version: 4,
      input: trimmed,
      cidr,
      octets,
      networkInt,
      broadcastInt,
      network: octetsToDotted(networkOctets),
      broadcast: octetsToDotted(broadcastOctets),
      subnetMask: octetsToDotted(maskOctets),
      wildcardMask: octetsToDotted(wildcardOctets),
      firstUsable,
      lastUsable,
      totalAddresses,
      usableHosts,
      ipClass,
      type,
      binary,
    },
  }
}

/* --------------------------------------------------------------------------
 * Display helpers
 * ------------------------------------------------------------------------ */

export function typeBadgeClass(type: Ipv4Type): string {
  switch (type) {
    case 'Private':
      return 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
    case 'Public':
      return 'bg-sky-100 text-sky-700 border-sky-300 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800'
    case 'Loopback':
      return 'bg-violet-100 text-violet-700 border-violet-300 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800'
    case 'Link-Local':
      return 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
    case 'Multicast':
      return 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300 dark:bg-fuchsia-950/40 dark:text-fuchsia-300 dark:border-fuchsia-800'
    case 'Reserved':
      return 'bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
    case 'This Network':
      return 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700'
    case 'Documentation':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-800'
  }
}