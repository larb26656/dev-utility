import { describe, expect, it } from 'vitest'
import { loremTool } from './lorem'

describe('Lorem Ipsum', () => {
  it('generates lorem ipsum text', async () => {
    const result = await loremTool.generate()
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('generates 50 words by default', async () => {
    const result = await loremTool.generate()
    const words = result.split(' ')
    expect(words.length).toBe(50)
  })

  it('generates words from lorem vocabulary', async () => {
    const result = await loremTool.generate()
    const words = result.split(' ')
    const validWords = [
      'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing',
      'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore',
      'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam',
      'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi',
      'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure',
      'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'fugiat',
      'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat',
      'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
      'mollit', 'anim', 'id', 'est', 'laborum'
    ]
    for (const word of words) {
      expect(validWords).toContain(word)
    }
  })

  it('generates different output on multiple calls', async () => {
    const result1 = await loremTool.generate()
    const result2 = await loremTool.generate()
    expect(result1).not.toBe(result2)
  })

  it('returns space-separated words', async () => {
    const result = await loremTool.generate()
    expect(result).toMatch(/^[a-z]+(\s[a-z]+){49}$/)
  })
})
