import type { BaseTool } from '../types'

export interface SnippetItem {
  key: string
  value: string
  description?: string
}

export interface SnippetTool extends BaseTool {
  type: 'snippet'
  items: Array<SnippetItem>
}
