import { useMemo, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { toast } from 'sonner'
import type { SnippetInstance, SnippetTool } from '@/lib/tools/snippet'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface SnippetConsoleProps {
  tool: SnippetTool
  instance: SnippetInstance
}

export function SnippetConsole({ instance }: SnippetConsoleProps) {
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const items = instance.getItems()

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items
    const query = search.toLowerCase()
    return items.filter(
      (item) =>
        item.key.toLowerCase().includes(query) ||
        item.value.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.keywords?.some((kw) => kw.toLowerCase().includes(query)),
    )
  }, [items, search])

  const handleCopy = async (item: (typeof items)[number]) => {
    try {
      await navigator.clipboard.writeText(item.value)
      setCopiedId(item.key)
      toast.success(`Copied: ${item.key}`)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 space-y-4">
      <Input
        type="search"
        placeholder="Search snippets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-11"
      />

      <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-2">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No snippets found
          </div>
        ) : (
          filteredItems.map((item) => (
            <Card
              key={item.key}
              className="group overflow-hidden border-border/60 bg-card/60 backdrop-blur hover:bg-accent/40 transition-colors p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{item.key}</span>
                  </div>
                  <code className="text-xs text-muted-foreground block truncate">
                    {item.value}
                  </code>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {item.description}
                    </p>
                  )}
                </div>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => handleCopy(item)}
                  className="shrink-0 opacity-60 group-hover:opacity-100 transition-opacity"
                >
                  {copiedId === item.key ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <div className="text-center text-[10px] text-muted-foreground leading-tight">
        {filteredItems.length} of {items.length} snippets
      </div>
    </div>
  )
}
