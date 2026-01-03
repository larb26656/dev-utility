import {
  base64Conversion,
  bcryptConversion,
  dataFormatTool,
  loremConversion,
  md5Conversion,
  sha256Conversion,
  upperCaseConversion,
  uuidConversion,
} from '.'
import { registry } from '@/lib/tools/registry'

registry.register(base64Conversion)
registry.register(md5Conversion)
registry.register(sha256Conversion)
registry.register(bcryptConversion)
registry.register(upperCaseConversion)
registry.register(loremConversion)
registry.register(uuidConversion)
registry.register(dataFormatTool)

const SEARCH_LIST = registry.getAll().map((tool) => ({
  id: tool.id,
  name: tool.name,
  category: tool.category,
  href: `/tool/${tool.id}`,
}))

export { registry, SEARCH_LIST }
