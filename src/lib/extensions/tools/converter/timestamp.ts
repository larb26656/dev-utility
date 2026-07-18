import { createFreeStyleTool } from '@/lib/tools/freestyle'
import { TimestampConsole } from '@/components/tool/console/TimestampConsole'

export const timestampTool = createFreeStyleTool({
  id: 'timestamp',
  name: 'Timestamp',
  description: 'Convert between timestamps and human-readable dates',
  category: 'Converter',
  component: TimestampConsole,
})
