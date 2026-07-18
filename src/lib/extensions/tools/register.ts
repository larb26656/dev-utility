import {
  base64Tool,
  bcryptTool,
  caseConverterTool,
  colorTool,
  cronTool,
  curlTool,
  dataFormatTool,
  dockerCliToComposeTool,
  fileOpsTool,
  httpStatusTool,
  jqTool,
  jwtDecoderTool,
  loremTool,
  md5Tool,
  permissionTool,
  portTool,
  postgresqlTool,
  regexTool,
  sha256Tool,
  stringEscapeTool,
  systemTool,
  textProcessTool,
  timestampTool,
  upperCaseTool,
  urlEscapeTool,
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
registry.register(caseConverterTool)
registry.register(jwtDecoderTool)
registry.register(colorTool)
registry.register(cronTool)
registry.register(permissionTool)
registry.register(timestampTool)
registry.register(portTool)
registry.register(regexTool)
registry.register(textProcessTool)
registry.register(fileOpsTool)
registry.register(curlTool)
registry.register(jqTool)
registry.register(stringEscapeTool)
registry.register(systemTool)
registry.register(httpStatusTool)
registry.register(urlEscapeTool)
registry.register(postgresqlTool)

export { registry }
