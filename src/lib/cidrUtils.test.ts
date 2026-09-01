import { describe, expect, it } from 'vitest'
import {
  cidrToMaskInt,
  classifyIpv4Class,
  classifyIpv4Type,
  intToIpv4,
  ipv4ToInt,
  isValidOctet,
  octetToBinary,
  parseIpv4Cidr,
  typeBadgeClass,
} from './cidrUtils'

describe('isValidOctet', () => {
  it('accepts 0-255', () => {
    expect(isValidOctet('0')).toBe(true)
    expect(isValidOctet('255')).toBe(true)
    expect(isValidOctet('192')).toBe(true)
  })

  it('rejects out-of-range, leading zeros, and non-numeric', () => {
    expect(isValidOctet('256')).toBe(false)
    expect(isValidOctet('-1')).toBe(false)
    expect(isValidOctet('01')).toBe(false)
    expect(isValidOctet('abc')).toBe(false)
    expect(isValidOctet('')).toBe(false)
  })
})

describe('ipv4ToInt / intToIpv4', () => {
  it('round-trips dotted octets', () => {
    const cases = [
      [0, 0, 0, 0],
      [255, 255, 255, 255],
      [192, 168, 0, 1],
      [10, 0, 0, 0],
      [127, 0, 0, 1],
    ] as const
    for (const octets of cases) {
      expect(intToIpv4(ipv4ToInt([...octets]))).toEqual([...octets])
    }
  })

  it('handles 32-bit unsigned', () => {
    expect(ipv4ToInt([255, 255, 255, 255])).toBe(0xffffffff)
    expect(intToIpv4(0xffffffff)).toEqual([255, 255, 255, 255])
  })
})

describe('cidrToMaskInt', () => {
  it('returns 0 for /0', () => {
    expect(cidrToMaskInt(0)).toBe(0)
  })

  it('returns all-ones for /32', () => {
    expect(cidrToMaskInt(32)).toBe(0xffffffff)
  })

  it('returns /24 mask', () => {
    expect(cidrToMaskInt(24)).toBe(0xffffff00)
  })
})

describe('octetToBinary', () => {
  it('pads to 8 bits', () => {
    expect(octetToBinary(0)).toBe('00000000')
    expect(octetToBinary(255)).toBe('11111111')
    expect(octetToBinary(192)).toBe('11000000')
  })
})

describe('classifyIpv4Class', () => {
  it('classifies by leading bit pattern', () => {
    expect(classifyIpv4Class(10)).toBe('A')
    expect(classifyIpv4Class(127)).toBe('A')
    expect(classifyIpv4Class(128)).toBe('B')
    expect(classifyIpv4Class(172)).toBe('B')
    expect(classifyIpv4Class(192)).toBe('C')
    expect(classifyIpv4Class(223)).toBe('C')
    expect(classifyIpv4Class(224)).toBe('D')
    expect(classifyIpv4Class(239)).toBe('D')
    expect(classifyIpv4Class(240)).toBe('E')
    expect(classifyIpv4Class(255)).toBe('E')
  })
})

describe('classifyIpv4Type', () => {
  it('detects RFC 1918 private ranges', () => {
    expect(classifyIpv4Type(ipv4ToInt([10, 1, 2, 3]), 8)).toBe('Private')
    expect(classifyIpv4Type(ipv4ToInt([172, 16, 5, 4]), 16)).toBe('Private')
    expect(classifyIpv4Type(ipv4ToInt([172, 31, 255, 254]), 16)).toBe('Private')
    expect(classifyIpv4Type(ipv4ToInt([192, 168, 1, 1]), 24)).toBe('Private')
  })

  it('detects loopback', () => {
    expect(classifyIpv4Type(ipv4ToInt([127, 0, 0, 1]), 8)).toBe('Loopback')
  })

  it('detects link-local', () => {
    expect(classifyIpv4Type(ipv4ToInt([169, 254, 10, 20]), 16)).toBe('Link-Local')
  })

  it('detects multicast', () => {
    expect(classifyIpv4Type(ipv4ToInt([224, 0, 0, 1]), 4)).toBe('Multicast')
    expect(classifyIpv4Type(ipv4ToInt([239, 255, 255, 250]), 8)).toBe('Multicast')
  })

  it('detects reserved / class E', () => {
    expect(classifyIpv4Type(ipv4ToInt([240, 0, 0, 1]), 4)).toBe('Reserved')
    expect(classifyIpv4Type(ipv4ToInt([255, 255, 255, 255]), 4)).toBe('Reserved')
  })

  it('detects documentation ranges', () => {
    expect(classifyIpv4Type(ipv4ToInt([192, 0, 2, 0]), 24)).toBe('Documentation')
    expect(classifyIpv4Type(ipv4ToInt([198, 51, 100, 5]), 24)).toBe('Documentation')
    expect(classifyIpv4Type(ipv4ToInt([203, 0, 113, 7]), 24)).toBe('Documentation')
  })

  it('detects "this network" 0.0.0.0/8', () => {
    expect(classifyIpv4Type(ipv4ToInt([0, 0, 0, 0]), 8)).toBe('This Network')
  })

  it('falls through to Public', () => {
    expect(classifyIpv4Type(ipv4ToInt([8, 8, 8, 0]), 24)).toBe('Public')
    expect(classifyIpv4Type(ipv4ToInt([1, 1, 1, 0]), 24)).toBe('Public')
  })
})

describe('parseIpv4Cidr', () => {
  describe('valid inputs', () => {
    it('parses 192.1.168.0/24 from the original example', () => {
      const result = parseIpv4Cidr('192.1.168.0/24')
      expect(result.ok).toBe(true)
      if (!result.ok) return
      expect(result.info.network).toBe('192.1.168.0')
      expect(result.info.broadcast).toBe('192.1.168.255')
      expect(result.info.subnetMask).toBe('255.255.255.0')
      expect(result.info.wildcardMask).toBe('0.0.0.255')
      expect(result.info.firstUsable).toBe('192.1.168.1')
      expect(result.info.lastUsable).toBe('192.1.168.254')
      expect(result.info.totalAddresses).toBe(256)
      expect(result.info.usableHosts).toBe(254)
      expect(result.info.cidr).toBe(24)
      expect(result.info.ipClass).toBe('C')
      expect(result.info.type).toBe('Public')
    })

    it('parses 192.168.0.0/16 as Private class C', () => {
      const result = parseIpv4Cidr('192.168.0.0/16')
      expect(result.ok).toBe(true)
      if (!result.ok) return
      expect(result.info.network).toBe('192.168.0.0')
      expect(result.info.broadcast).toBe('192.168.255.255')
      expect(result.info.subnetMask).toBe('255.255.0.0')
      expect(result.info.firstUsable).toBe('192.168.0.1')
      expect(result.info.lastUsable).toBe('192.168.255.254')
      expect(result.info.usableHosts).toBe(65534)
      expect(result.info.type).toBe('Private')
    })

    it('parses 10.0.0.0/8 as Private class A', () => {
      const result = parseIpv4Cidr('10.0.0.0/8')
      expect(result.ok).toBe(true)
      if (!result.ok) return
      expect(result.info.network).toBe('10.0.0.0')
      expect(result.info.broadcast).toBe('10.255.255.255')
      expect(result.info.subnetMask).toBe('255.0.0.0')
      expect(result.info.totalAddresses).toBe(Math.pow(2, 24))
      expect(result.info.usableHosts).toBe(16777214)
      expect(result.info.type).toBe('Private')
      expect(result.info.ipClass).toBe('A')
    })

    it('parses 172.16.0.0/12 as Private class B', () => {
      const result = parseIpv4Cidr('172.16.0.0/12')
      expect(result.ok).toBe(true)
      if (!result.ok) return
      expect(result.info.network).toBe('172.16.0.0')
      expect(result.info.broadcast).toBe('172.31.255.255')
      expect(result.info.subnetMask).toBe('255.240.0.0')
      expect(result.info.type).toBe('Private')
      expect(result.info.ipClass).toBe('B')
    })

    it('handles /30 (point-to-point-ish, 2 usable hosts)', () => {
      const result = parseIpv4Cidr('192.168.1.0/30')
      expect(result.ok).toBe(true)
      if (!result.ok) return
      expect(result.info.network).toBe('192.168.1.0')
      expect(result.info.broadcast).toBe('192.168.1.3')
      expect(result.info.firstUsable).toBe('192.168.1.1')
      expect(result.info.lastUsable).toBe('192.168.1.2')
      expect(result.info.totalAddresses).toBe(4)
      expect(result.info.usableHosts).toBe(2)
    })

    it('handles /31 (RFC 3021: both addresses usable)', () => {
      const result = parseIpv4Cidr('10.0.0.0/31')
      expect(result.ok).toBe(true)
      if (!result.ok) return
      expect(result.info.totalAddresses).toBe(2)
      expect(result.info.usableHosts).toBe(2)
      expect(result.info.firstUsable).toBe('10.0.0.0')
      expect(result.info.lastUsable).toBe('10.0.0.1')
    })

    it('handles /32 (single host)', () => {
      const result = parseIpv4Cidr('192.168.0.5/32')
      expect(result.ok).toBe(true)
      if (!result.ok) return
      expect(result.info.totalAddresses).toBe(1)
      expect(result.info.usableHosts).toBe(1)
      expect(result.info.firstUsable).toBeNull()
      expect(result.info.lastUsable).toBeNull()
      expect(result.info.network).toBe('192.168.0.5')
      expect(result.info.broadcast).toBe('192.168.0.5')
    })

    it('handles /0', () => {
      const result = parseIpv4Cidr('0.0.0.0/0')
      expect(result.ok).toBe(true)
      if (!result.ok) return
      expect(result.info.network).toBe('0.0.0.0')
      expect(result.info.broadcast).toBe('255.255.255.255')
      expect(result.info.subnetMask).toBe('0.0.0.0')
      expect(result.info.firstUsable).toBe('0.0.0.1')
      expect(result.info.lastUsable).toBe('255.255.255.254')
      expect(result.info.totalAddresses).toBe(Math.pow(2, 32))
      expect(result.info.usableHosts).toBe(4294967294)
      expect(result.info.type).toBe('This Network')
    })

    it('masks an input that is not the network address', () => {
      const result = parseIpv4Cidr('192.168.0.123/24')
      expect(result.ok).toBe(true)
      if (!result.ok) return
      expect(result.info.network).toBe('192.168.0.0')
      expect(result.info.broadcast).toBe('192.168.0.255')
    })

    it('builds binary representation split at octet boundary', () => {
      const result = parseIpv4Cidr('192.168.0.0/24')
      expect(result.ok).toBe(true)
      if (!result.ok) return
      expect(result.info.binary.octets[0].network).toBe('11000000')
      expect(result.info.binary.octets[0].host).toBe('')
      expect(result.info.binary.octets[1].network).toBe('10101000')
      expect(result.info.binary.octets[2].network).toBe('00000000')
      expect(result.info.binary.octets[3].network).toBe('')
      expect(result.info.binary.octets[3].host).toBe('00000000')
    })

    it('builds binary representation split mid-octet', () => {
      const result = parseIpv4Cidr('192.168.0.0/20')
      expect(result.ok).toBe(true)
      if (!result.ok) return
      // /20 = 2 full octets + 4 bits into the third octet
      expect(result.info.binary.octets[0].network).toBe('11000000')
      expect(result.info.binary.octets[1].network).toBe('10101000')
      expect(result.info.binary.octets[2].network).toBe('0000')
      expect(result.info.binary.octets[2].host).toBe('0000')
      expect(result.info.binary.octets[3].host).toBe('00000000')
    })

    it('trims surrounding whitespace', () => {
      const result = parseIpv4Cidr('  10.0.0.0/8  ')
      expect(result.ok).toBe(true)
      if (!result.ok) return
      expect(result.info.network).toBe('10.0.0.0')
    })
  })

  describe('invalid inputs', () => {
    const cases: Array<[string, RegExp]> = [
      ['', /required/i],
      ['   ', /required/i],
      ['192.168.0.0', /prefix/i],
      ['192.168.0.0/', /prefix/i],
      ['192.168.0.0/24/24', /prefix/i],
      ['192.168.0.0/33', /between 0 and 32/i],
      ['192.168.0.0/-1', /between 0 and 32/i],
      ['192.168.0.0/abc', /between 0 and 32/i],
      ['192.168.0/24', /4 octets/i],
      ['192.168.0.0.0/24', /4 octets/i],
      ['256.0.0.0/24', /octet/i],
      ['192.168.0.256/24', /octet/i],
      ['192.168.0.-1/24', /octet/i],
      ['192.168.0.01/24', /octet/i],
      ['abc/24', /4 octets/i],
    ]

    for (const [input, pattern] of cases) {
      it(`rejects "${input}"`, () => {
        const result = parseIpv4Cidr(input)
        expect(result.ok).toBe(false)
        if (result.ok) return
        expect(result.error).toMatch(pattern)
      })
    }
  })
})

describe('typeBadgeClass', () => {
  it('returns a non-empty class string for every type', () => {
    const types = [
      'Private',
      'Public',
      'Loopback',
      'Link-Local',
      'Multicast',
      'Reserved',
      'This Network',
      'Documentation',
    ] as const
    for (const t of types) {
      expect(typeBadgeClass(t)).toContain('bg-')
      expect(typeBadgeClass(t)).toContain('text-')
    }
  })
})