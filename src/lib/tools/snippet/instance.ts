import type { SnippetItem, SnippetTool } from './types'

export interface SnippetInstance {
  getItems: () => Array<SnippetItem>
  getOutputLabel: () => string
}

export function createSnippetInstance(tool: SnippetTool): SnippetInstance {
  return {
    getItems: () => tool.items,
    getOutputLabel: () => tool.name,
  }
}
