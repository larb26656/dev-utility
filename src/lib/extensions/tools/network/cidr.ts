import { createFreeStyleTool } from '@/lib/tools/freestyle'
import { CidrConsole } from '@/components/tool/console/CidrConsole'

export const cidrTool = createFreeStyleTool({
  id: 'cidr',
  name: 'IPv4 CIDR Calculator',
  description:
    'Parse and explain IPv4 CIDR notation (e.g. 192.1.168.0/24). Shows network address, broadcast, subnet mask, wildcard mask, usable host range, IP class, type (private/public/loopback/etc), and a binary visualization.',
  category: 'Network',
  component: CidrConsole,
})
