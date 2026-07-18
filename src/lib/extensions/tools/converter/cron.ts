import { createFreeStyleTool } from '@/lib/tools/freestyle'
import { CronConsole } from '@/components/tool/console/CronConsole'

export const cronTool = createFreeStyleTool({
  id: 'cron',
  name: 'Cron Expression Builder',
  description: 'Build and validate cron expressions with a visual editor, human-readable descriptions, and next execution times',
  category: 'Converter',
  component: CronConsole,
})