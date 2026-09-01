import { describe, expect, it } from 'vitest'
import { cidrTool } from './cidr'

describe('CIDR Tool', () => {
  it('has correct tool metadata', () => {
    expect(cidrTool.id).toBe('cidr')
    expect(cidrTool.name).toBe('IPv4 CIDR Calculator')
    expect(cidrTool.category).toBe('Network')
  })

  it('is a freestyle tool type', () => {
    expect(cidrTool.type).toBe('freestyle')
  })

  it('has a component defined', () => {
    expect(cidrTool.component).toBeDefined()
    expect(typeof cidrTool.component).toBe('function')
  })

  it('has a non-trivial description', () => {
    expect(cidrTool.description).toBeTruthy()
    expect(cidrTool.description?.length ?? 0).toBeGreaterThan(20)
  })
})
