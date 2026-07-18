import { createFreeStyleTool } from '@/lib/tools/freestyle'
import { PermissionConsole } from '@/components/tool/console/PermissionConsole'

export const permissionTool = createFreeStyleTool({
  id: 'permission',
  name: 'Permissions Calculator',
  description: 'Calculate Unix file permissions in octal notation (e.g., 755, 644) for chmod commands',
  category: 'Converter',
  component: PermissionConsole,
})
