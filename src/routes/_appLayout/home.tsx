import { ToolCard } from '@/components/tool/ToolCard'
import { Separator } from '@/components/ui/separator'
import { registry } from '@/lib/extensions/tools/register'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_appLayout/home')({
  component: RouteComponent,
  loader: () => {
    return { crumb: 'Home' }
  },
})

function RouteComponent() {
  const navigate = useNavigate()
  const toolGroups = registry.getGroups()
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-primary rounded-lg p-6 text-primary-foreground">
        <h1 className="text-3xl font-bold">👋 Hi</h1>
        <h1 className="text-2xl font-semibold mt-2">Can I help you?</h1>
      </div>
      <Separator />
      {toolGroups.map((group) => {
        return (
          <div key={group.category}>
            <h2 className="pb-4 text-lg font-semibold first:mt-0">
              {group.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.tools.map((tool) => {
                return (
                  <ToolCard
                    key={tool.id}
                    title={tool.name}
                    description={tool.description || ''}
                    onClick={() =>
                      navigate({
                        to: '/tool/$toolId',
                        params: { toolId: tool.id },
                      })
                    }
                  />
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
