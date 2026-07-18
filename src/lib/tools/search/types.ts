export type ToolSearchItem = {
  resultType: 'tool'
  id: string
  name: string
  category: string
  description?: string
  href: string
}

export type SnippetSearchItem = {
  resultType: 'snippet'
  toolId: string
  toolName: string
  key: string
  value: string
  description?: string
}

export type SearchResultItem = ToolSearchItem | SnippetSearchItem
