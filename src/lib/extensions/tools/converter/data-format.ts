import { stringify as dumpYaml, parse as parseYaml } from 'yaml'
// import { stringify as dumpToml, parse as parseToml } from '@iarna/toml'
import { XMLBuilder, XMLParser } from 'fast-xml-parser'
import { createNWayTransformerTool } from '@/lib/tools/transformer'

const xmlParser = new XMLParser({ ignoreAttributes: false })
const xmlBuilder = new XMLBuilder({ ignoreAttributes: false })

export const dataFormatTool = createNWayTransformerTool<
  {
    json: string
    yaml: string
    // toml: string
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

    // toml: {
    //   toIR: (input) => parseToml(input),
    //   fromIR: (ir) => dumpToml(ir),
    // },

    xml: {
      toIR: (input) => xmlParser.parse(input),
      fromIR: (ir) => xmlBuilder.build(ir),
    },
  },
})
