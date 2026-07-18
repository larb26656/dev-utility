import type { BaseTool } from '../types'

export interface FreeStyleTool extends BaseTool {
  type: 'freestyle'
  component: React.ComponentType<{ tool: FreeStyleTool }>
}
