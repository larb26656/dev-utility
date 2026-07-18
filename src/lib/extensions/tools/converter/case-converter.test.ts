import { describe, expect, it } from 'vitest'
import { caseConverterTool } from './case-converter'

describe('Case Converter', () => {
  it('has correct tool metadata', () => {
    expect(caseConverterTool.id).toBe('case-converter')
    expect(caseConverterTool.name).toBe('Case Converter')
    expect(caseConverterTool.category).toBe('Converter')
  })

  it('is a n-way transformer tool type', () => {
    expect(caseConverterTool.type).toBe('transformer')
    expect(caseConverterTool.transformType).toBe('n-way')
  })

  it('has all case style transformers', () => {
    expect(caseConverterTool.transformers).toHaveProperty('camelCase')
    expect(caseConverterTool.transformers).toHaveProperty('snake_case')
    expect(caseConverterTool.transformers).toHaveProperty('kebab-case')
    expect(caseConverterTool.transformers).toHaveProperty('PascalCase')
  })

  describe('camelCase', () => {
    it('converts snake_case to camelCase', () => {
      const result = caseConverterTool.convert('snake_case', 'camelCase', 'hello_world')
      expect(result).toBe('helloWorld')
    })

    it('converts kebab-case to camelCase', () => {
      const result = caseConverterTool.convert('kebab-case', 'camelCase', 'hello-world')
      expect(result).toBe('helloWorld')
    })

    it('converts PascalCase to camelCase', () => {
      const result = caseConverterTool.convert('PascalCase', 'camelCase', 'HelloWorld')
      expect(result).toBe('helloWorld')
    })

    it('handles already camelCase input', () => {
      const result = caseConverterTool.convert('camelCase', 'camelCase', 'helloWorld')
      expect(result).toBe('helloWorld')
    })
  })

  describe('snake_case', () => {
    it('converts camelCase to snake_case', () => {
      const result = caseConverterTool.convert('camelCase', 'snake_case', 'helloWorld')
      expect(result).toBe('hello_world')
    })

    it('converts kebab-case to snake_case', () => {
      const result = caseConverterTool.convert('kebab-case', 'snake_case', 'hello-world')
      expect(result).toBe('hello_world')
    })

    it('converts PascalCase to snake_case', () => {
      const result = caseConverterTool.convert('PascalCase', 'snake_case', 'HelloWorld')
      expect(result).toBe('hello_world')
    })
  })

  describe('kebab-case', () => {
    it('converts camelCase to kebab-case', () => {
      const result = caseConverterTool.convert('camelCase', 'kebab-case', 'helloWorld')
      expect(result).toBe('hello-world')
    })

    it('converts snake_case to kebab-case', () => {
      const result = caseConverterTool.convert('snake_case', 'kebab-case', 'hello_world')
      expect(result).toBe('hello-world')
    })

    it('converts PascalCase to kebab-case', () => {
      const result = caseConverterTool.convert('PascalCase', 'kebab-case', 'HelloWorld')
      expect(result).toBe('hello-world')
    })
  })

  describe('PascalCase', () => {
    it('converts camelCase to PascalCase', () => {
      const result = caseConverterTool.convert('camelCase', 'PascalCase', 'helloWorld')
      expect(result).toBe('HelloWorld')
    })

    it('converts snake_case to PascalCase', () => {
      const result = caseConverterTool.convert('snake_case', 'PascalCase', 'hello_world')
      expect(result).toBe('HelloWorld')
    })

    it('converts kebab-case to PascalCase', () => {
      const result = caseConverterTool.convert('kebab-case', 'PascalCase', 'hello-world')
      expect(result).toBe('HelloWorld')
    })
  })

  describe('edge cases', () => {
    it('handles empty string', () => {
      const result = caseConverterTool.convert('camelCase', 'snake_case', '')
      expect(result).toBe('')
    })

    it('handles single word', () => {
      const result = caseConverterTool.convert('camelCase', 'snake_case', 'hello')
      expect(result).toBe('hello')
    })

    it('handles multiple words', () => {
      const result = caseConverterTool.convert('camelCase', 'kebab-case', 'helloWorldFromThailand')
      expect(result).toBe('hello-world-from-thailand')
    })

    it('handles words with numbers', () => {
      const result = caseConverterTool.convert('camelCase', 'snake_case', 'userName123')
      expect(result).toBe('user_name123')
    })
  })

  describe('roundtrip', () => {
    it('roundtrips camelCase through all formats', () => {
      const original = 'helloWorld'
      const snake = caseConverterTool.convert('camelCase', 'snake_case', original)
      const kebab = caseConverterTool.convert('camelCase', 'kebab-case', original)
      const pascal = caseConverterTool.convert('camelCase', 'PascalCase', original)

      expect(caseConverterTool.convert('snake_case', 'camelCase', snake)).toBe(original)
      expect(caseConverterTool.convert('kebab-case', 'camelCase', kebab)).toBe(original)
      expect(caseConverterTool.convert('PascalCase', 'camelCase', pascal)).toBe(original)
    })

    it('roundtrips snake_case through all formats', () => {
      const original = 'hello_world_test'
      const camel = caseConverterTool.convert('snake_case', 'camelCase', original)
      const kebab = caseConverterTool.convert('snake_case', 'kebab-case', original)
      const pascal = caseConverterTool.convert('snake_case', 'PascalCase', original)

      expect(caseConverterTool.convert('camelCase', 'snake_case', camel)).toBe(original)
      expect(caseConverterTool.convert('kebab-case', 'snake_case', kebab)).toBe(original)
      expect(caseConverterTool.convert('PascalCase', 'snake_case', pascal)).toBe(original)
    })
  })
})