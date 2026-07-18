import type { SnippetTool } from './types'

export function createSnippetTool(
  input: Omit<SnippetTool, 'type'>,
): SnippetTool {
  return {
    ...input,
    type: 'snippet',
  }
}
