import type { FreeStyleTool } from './types'

export function createFreeStyleTool<
  T extends Omit<FreeStyleTool, 'type'>,
>(input: T): FreeStyleTool {
  return {
    ...input,
    type: 'freestyle',
  }
}
