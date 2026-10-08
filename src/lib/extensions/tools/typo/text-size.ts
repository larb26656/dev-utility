import { createFreeStyleTool } from '@/lib/tools/freestyle'
import { TextSizeConsole } from '@/components/tool/console/TextSizeConsole'

export const textSizeTool = createFreeStyleTool({
  id: 'text-size',
  name: 'Text Size',
  description:
    'Debug text size — measure UTF-8 bytes, kilobytes and character count in real time',
  category: 'Typo',
  component: TextSizeConsole,
})
