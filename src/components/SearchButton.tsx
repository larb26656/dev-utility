import * as React from 'react'
import { Search } from 'lucide-react'

import { useNavigate } from '@tanstack/react-router'
import { Button } from './ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { SEARCH_LIST } from '@/lib/extensions/tools/register'
import { useRecentToolsStore } from '@/stores/recentToolsStore'

export function SearchButton() {
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(false)
  const { recentTools } = useRecentToolsStore()

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleSearchClick = () => {
    setOpen(true)
  }

  const runCommand = React.useCallback((fn: () => void) => {
    setOpen(false)
    fn()
  }, [])

  return (
    <>
      <Button variant={'outline'} onClick={handleSearchClick} size={'sm'}>
        <p className="text-sm text-muted-foreground hidden md:block">
          Search...{' '}
          <kbd className="pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
            <span className="text-xs">⌘</span>K
          </kbd>
        </p>
        <Search className="md:hidden" />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search tools..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {recentTools.length > 0 && (
            <>
              <CommandGroup heading="Recent">
                {recentTools.map((tool) => (
                  <CommandItem
                    key={tool.id}
                    value={`recent ${tool.name}`}
                    onSelect={() =>
                      runCommand(() =>
                        navigate({
                          to: `/tool/${tool.id}`,
                        }),
                      )
                    }
                  >
                    <span>{tool.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          <CommandGroup heading="Tools">
            {SEARCH_LIST.map((tool) => {
              return (
                <CommandItem
                  key={tool.id}
                  value={[tool.id, tool.name, tool.category].join(' ')}
                  onSelect={() =>
                    runCommand(() =>
                      navigate({
                        to: tool.href,
                      }),
                    )
                  }
                >
                  <span>{tool.name}</span>
                </CommandItem>
              )
            })}
          </CommandGroup>

          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  )
}
