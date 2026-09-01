import { createFreeStyleTool } from '@/lib/tools/freestyle'
import { EisenhowerConsole } from '@/components/tool/console/EisenhowerConsole'

export const eisenhowerTool = createFreeStyleTool({
  id: 'eisenhower',
  name: 'Eisenhower Matrix',
  description:
    'Organize tasks by urgency and importance into a 2x2 priority matrix',
  category: 'Productivity',
  component: EisenhowerConsole,
})
