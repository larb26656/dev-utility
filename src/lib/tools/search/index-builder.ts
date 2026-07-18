import type { Tool } from '../types'
import type { SearchResultItem, SnippetSearchItem, ToolSearchItem } from './types'

export function buildSearchIndex(tools: Array<Tool>): Array<SearchResultItem> {
  const toolItems: Array<ToolSearchItem> = []
  const snippetItems: Array<SnippetSearchItem> = []

  for (const tool of tools) {
    if (tool.type === 'snippet') {
      for (const item of tool.items) {
        snippetItems.push({
          resultType: 'snippet',
          toolId: tool.id,
          toolName: tool.name,
          key: item.key,
          value: item.value,
          description: item.description,
        })
      }
    } else {
      toolItems.push({
        resultType: 'tool',
        id: tool.id,
        name: tool.name,
        category: tool.category,
        description: tool.description,
        href: `/tool/${tool.id}`,
      })
    }
  }

  return [...toolItems, ...snippetItems]
}
