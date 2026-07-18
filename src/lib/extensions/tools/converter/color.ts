import { createFreeStyleTool } from '@/lib/tools/freestyle'
import { ColorConsole } from '@/components/tool/console/ColorConsole'

export const colorTool = createFreeStyleTool({
  id: 'color',
  name: 'Color',
  description: 'Pick colors, convert between formats, and explore color harmony',
  category: 'Converter',
  component: ColorConsole,
})
