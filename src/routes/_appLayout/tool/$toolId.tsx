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
})

function RouteComponent() {
  const { tool } = Route.useLoaderData()

  if (tool.type === 'generator') {
    const instance = createGeneratorInstance(tool)
    return <GeneratorConsole tool={tool} instance={instance} />
  } else {
    const instance = createTransformerInstance(tool)
    if (tool.transformType === 'n-way') {
      return (
        <NWayTransformerConsole
          tool={tool}
          instance={instance as NWayTransformerInstance}
        />
      )
    } else {
      return <TransformerConsole tool={tool} instance={instance} />
    }
  }

  return <div>Not support</div>
}
