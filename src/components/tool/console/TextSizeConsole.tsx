import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { Copy, Eraser, Ruler } from 'lucide-react'
import type { FreeStyleTool } from '@/lib/tools/freestyle'
import { computeTextStats, formatSize } from '@/lib/textSizeUtils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

interface TextSizeConsoleProps {
  tool: FreeStyleTool
}

interface StatRow {
  label: string
  value: string
}

export function TextSizeConsole({ tool }: TextSizeConsoleProps) {
  const [text, setText] = useState('')

  const stats = computeTextStats(text)

  const rows: Array<StatRow> = [
    { label: 'Bytes (UTF-8)', value: stats.bytes.toLocaleString() },
    { label: 'Kilobytes', value: `${stats.kilobytes.toLocaleString(undefined, { maximumFractionDigits: 2 })} KB` },
    { label: 'Human Readable', value: formatSize(stats.bytes) },
    { label: 'Characters', value: stats.characters.toLocaleString() },
    { label: 'Characters (no spaces)', value: stats.charactersNoSpaces.toLocaleString() },
    { label: 'Words', value: stats.words.toLocaleString() },
    { label: 'Lines', value: stats.lines.toLocaleString() },
  ]

  const handleCopy = useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      toast.success('Copied to clipboard!')
    } catch {
      toast.error('Failed to copy')
    }
  }, [])

  const handleClear = useCallback(() => {
    setText('')
  }, [])

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 px-4 pb-24 md:pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{tool.name}</h1>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">Input</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <Eraser className="size-4 mr-1" />
              Clear
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste or type text here to inspect its size..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[160px] font-mono text-sm"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Ruler className="size-4" />
            Size & Count
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-xs text-muted-foreground mb-1">Bytes</p>
              <p className="text-2xl font-bold tabular-nums">{stats.bytes.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-xs text-muted-foreground mb-1">Kilobytes</p>
              <p className="text-2xl font-bold tabular-nums">
                {stats.kilobytes.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-xs text-muted-foreground mb-1">Characters</p>
              <p className="text-2xl font-bold tabular-nums">{stats.characters.toLocaleString()}</p>
            </div>
          </div>

          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/50"
            >
              <p className="text-xs font-medium text-muted-foreground">{row.label}</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-mono tabular-nums">{row.value}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0"
                  onClick={() => handleCopy(row.value)}
                >
                  <Copy className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="text-center text-[10px] md:text-xs text-muted-foreground leading-tight px-2">
        All measurements use UTF-8 encoding and are performed client-side. Your
        data never leaves your browser.
      </div>
    </div>
  )
}
