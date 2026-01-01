import { registry } from './conversion-registry'
import {
  base64Conversion,
  md5Conversion,
  upperCaseConversion,
} from './conversions'

registry.register(base64Conversion)
registry.register(md5Conversion)
registry.register(upperCaseConversion)

export { registry }
