import {
  base64Conversion,
  bcryptConversion,
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

export { registry }
