import { History } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from './ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useRecentToolsStore } from '@/stores/recentToolsStore'

export function RecentDropdown() {
  const navigate = useNavigate()
  const { recentTools, removeRecentTool } = useRecentToolsStore()

  if (recentTools.length === 0) {
    return null
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="px-2">
          <History className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="end">
        <div className="flex flex-col">
          {recentTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => navigate({ to: `/tool/${tool.id}` })}
              className="flex items-center justify-between px-3 py-2 text-sm hover:bg-accent cursor-pointer"
            >
              <span className="truncate">{tool.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeRecentTool(tool.id)
                }}
                className="ml-2 text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
