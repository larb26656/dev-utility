import { createFreeStyleTool } from '@/lib/tools/freestyle'
import { SatirConsole } from '@/components/tool/console/SatirConsole'

export const satirTool = createFreeStyleTool({
  id: 'satir',
  name: 'Satir Iceberg',
  description:
    'Guided self-reflection through Virginia Satir\u2019s Iceberg Model \u2014 peel back 5 layers from behavior to yearning',
  category: 'Productivity',
  component: SatirConsole,
})