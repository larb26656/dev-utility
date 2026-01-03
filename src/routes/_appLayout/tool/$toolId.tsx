import { createFileRoute } from '@tanstack/react-router'
import type { NWayTransformerInstance } from '@/lib/tools/transformer'
import { GeneratorConsole } from '@/components/tool/console/GeneratorConsole'
import { TransformerConsole } from '@/components/tool/console/TransformerConsole'
import { registry } from '@/lib/extensions/tools/register'
import { createGeneratorInstance } from '@/lib/tools/generator'
import { createTransformerInstance } from '@/lib/tools/transformer'
import { NWayTransformerConsole } from '@/components/tool/console/NWayTransformerConsole'

export const Route = createFileRoute('/_appLayout/tool/$toolId')({
  component: RouteComponent,
  loader: ({ params }) => {
    const tool = registry.get(params.toolId)

    if (!tool) {
      throw new Error('Conversion not found')
    }

    return { tool, crumb: tool.name }
  },
  validateSearch: (search: Record<string, unknown>) => ({
    inputFormat: (search.inputFormat as string) ?? '',
    outputFormat: (search.outputFormat as string) ?? '',
  }),
})

function RouteComponent() {
  const { tool } = Route.useLoaderData()
  const { toolId } = Route.useParams()
  const search = Route.useSearch()

  if (tool.type === 'generator') {
    const instance = createGeneratorInstance(tool)
    return <GeneratorConsole key={toolId} tool={tool} instance={instance} />
  } else {
    const instance = createTransformerInstance(tool)
    if (tool.transformType === 'n-way') {
      return (
        <NWayTransformerConsole
          key={toolId}
          tool={tool}
          instance={instance as NWayTransformerInstance}
          defaultInputFormat={search.inputFormat}
          defaultOutputFormat={search.outputFormat}
        />
      )
    } else {
      return <TransformerConsole key={toolId} tool={tool} instance={instance} />
    }
  }

  return <div>Not support</div>
}
