import * as React from 'react'
import { FileText, Search, Wrench } from 'lucide-react'

import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Button } from './ui/button'
import type { SearchResultItem, SnippetSearchItem, ToolSearchItem } from '@/lib/tools/search/types'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { registry } from '@/lib/tools/registry'
import { useRecentToolsStore } from '@/stores/recentToolsStore'

export function SearchButton() {
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<Array<SearchResultItem>>([])
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

  React.useEffect(() => {
    if (query.trim()) {
      const searchResults = registry.fuzzySearch(query)
      setResults(searchResults)
    } else {
      setResults([])
    }
  }, [query])

  const handleSearchClick = () => {
    setOpen(true)
    setQuery('')
    setResults([])
  }

  const runCommand = React.useCallback((fn: () => void) => {
    setOpen(false)
    fn()
  }, [])

  const handleToolClick = (item: ToolSearchItem) => {
    runCommand(() => navigate({ to: item.href }))
  }

  const handleSnippetClick = async (item: SnippetSearchItem) => {
    try {
      await navigator.clipboard.writeText(item.value)
      toast.success(`Copied: ${item.key}`)
      setOpen(false)
    } catch {
      toast.error('Failed to copy')
    }
  }

  const toolResults = results.filter((r) => r.resultType === 'tool')
  const snippetResults = results.filter((r) => r.resultType === 'snippet')

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
        <CommandInput
          placeholder="Type a command or search..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {recentTools.length > 0 && !query && (
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

          {query && toolResults.length > 0 && (
            <>
              <CommandGroup heading="Tools">
                {toolResults.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={`${item.name} ${item.category}`}
                    onSelect={() => handleToolClick(item)}
                  >
                    <Wrench className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{item.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {query && snippetResults.length > 0 && (
            <>
              <CommandGroup heading="Snippets">
                {snippetResults.map((item, idx) => (
                  <CommandItem
                    key={`${item.toolId}-${item.key}-${idx}`}
                    value={`${item.key} ${item.toolName}`}
                    onSelect={() => handleSnippetClick(item)}
                  >
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      {item.key}{' '}
                      <span className="text-muted-foreground">({item.toolName})</span>
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
