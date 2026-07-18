import { describe, expect, it } from 'vitest'
import { dataFormatTool } from './data-format'

describe('Data Formats', () => {
  it('has correct tool metadata', () => {
    expect(dataFormatTool.id).toBe('data-formats')
    expect(dataFormatTool.name).toBe('Data Formats')
    expect(dataFormatTool.category).toBe('Converter')
  })

  it('is a n-way transformer tool type', () => {
    expect(dataFormatTool.type).toBe('transformer')
    expect(dataFormatTool.transformType).toBe('n-way')
  })

  it('has json, yaml, and xml transformers', () => {
    expect(dataFormatTool.transformers).toHaveProperty('json')
    expect(dataFormatTool.transformers).toHaveProperty('yaml')
    expect(dataFormatTool.transformers).toHaveProperty('xml')
  })

  describe('JSON transformer', () => {
    it('converts JSON to IR', () => {
      const json = '{"name":"test"}'
      const ir = dataFormatTool.transformers.json.toIR(json)
      expect(ir).toEqual({ name: 'test' })
    })

    it('converts IR back to JSON', () => {
      const ir = { name: 'test' }
      const json = dataFormatTool.transformers.json.fromIR(ir)
      expect(JSON.parse(json)).toEqual({ name: 'test' })
    })
  })

  describe('YAML transformer', () => {
    it('converts YAML to IR', () => {
      const yaml = 'name: test'
      const ir = dataFormatTool.transformers.yaml.toIR(yaml)
      expect(ir).toEqual({ name: 'test' })
    })

    it('converts IR back to YAML', () => {
      const ir = { name: 'test' }
      const yaml = dataFormatTool.transformers.yaml.fromIR(ir)
      expect(yaml).toContain('name: test')
    })
  })

  describe('XML transformer', () => {
    it('converts XML to IR', () => {
      const xml = '<root><name>test</name></root>'
      const ir = dataFormatTool.transformers.xml.toIR(xml)
      expect(ir).toHaveProperty('root')
    })

    it('converts IR back to XML', () => {
      const ir = { root: { name: { '#text': 'test' } } }
      const xml = dataFormatTool.transformers.xml.fromIR(ir)
      expect(xml).toContain('<root>')
      expect(xml).toContain('<name>test</name>')
    })
  })

  describe('convert function', () => {
    it('converts JSON to YAML', () => {
      const json = JSON.stringify({ name: 'test', value: 123 })
      const result = dataFormatTool.convert('json', 'yaml', json)
      expect(result).toContain('name: test')
      expect(result).toContain('value: 123')
    })

    it('converts JSON to XML', () => {
      const json = JSON.stringify({ name: 'test' })
      const result = dataFormatTool.convert('json', 'xml', json)
      expect(result).toContain('<name>test</name>')
    })

    it('converts YAML to JSON', () => {
      const yaml = 'name: test\nvalue: 123'
      const result = dataFormatTool.convert('yaml', 'json', yaml)
      const parsed = JSON.parse(result)
      expect(parsed.name).toBe('test')
      expect(parsed.value).toBe(123)
    })

    it('converts XML to JSON', () => {
      const xml = '<root><name>test</name></root>'
      const result = dataFormatTool.convert('xml', 'json', xml)
      const parsed = JSON.parse(result)
      expect(parsed.root).toBeDefined()
    })

    it('converts YAML to XML', () => {
      const yaml = 'name: test'
      const result = dataFormatTool.convert('yaml', 'xml', yaml)
      expect(result).toContain('<name>test</name>')
    })

    it('converts XML to YAML', () => {
      const xml = '<root><name>test</name></root>'
      const result = dataFormatTool.convert('xml', 'yaml', xml)
      expect(result).toContain('name: test')
    })
  })
})
