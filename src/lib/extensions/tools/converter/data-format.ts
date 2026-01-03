import { stringify as dumpYaml, parse as parseYaml } from 'yaml'
import { XMLBuilder, XMLParser } from 'fast-xml-parser'
import { createNWayTransformerTool } from '@/lib/tools/transformer'

const xmlParser = new XMLParser({ ignoreAttributes: false })
const xmlBuilder = new XMLBuilder({ ignoreAttributes: false })

export const dataFormatTool = createNWayTransformerTool<
  {
    json: string
    yaml: string
    xml: string
  },
  Record<string, any>
>({
  id: 'data-formats',
  name: 'Data Formats',
  category: 'Converter',

  transformers: {
    json: {
      toIR: (input) => JSON.parse(input),
      fromIR: (ir) => JSON.stringify(ir),
    },
    yaml: {
      toIR: (input) => parseYaml(input),
      fromIR: (ir) => dumpYaml(ir),
    },
    xml: {
      toIR: (input) => xmlParser.parse(input),
      fromIR: (ir) => xmlBuilder.build(ir),
    },
  },
})
