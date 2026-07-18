import {
  base64Tool,
  bcryptTool,
  dataFormatTool,
  dockerCliToComposeTool,
  loremTool,
  md5Tool,
  portTool,
  regexTool,
  sha256Tool,
  shellTool,
  timestampTool,
  upperCaseTool,
  uuidTool,
} from '.'
import { registry } from '@/lib/tools/registry'

registry.register(base64Tool)
registry.register(md5Tool)
registry.register(sha256Tool)
registry.register(bcryptTool)
registry.register(upperCaseTool)
registry.register(loremTool)
registry.register(uuidTool)
registry.register(dataFormatTool)
registry.register(dockerCliToComposeTool)
registry.register(timestampTool)
registry.register(portTool)
registry.register(regexTool)
registry.register(shellTool)

const SEARCH_LIST = registry.getAll().map((tool) => ({
  id: tool.id,
  name: tool.name,
  category: tool.category,
  href: `/tool/${tool.id}`,
}))

export { registry, SEARCH_LIST }
