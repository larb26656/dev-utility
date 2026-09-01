import { useCallback, useEffect, useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import mermaid from 'mermaid'
import {
  TransformComponent,
  TransformWrapper
} from 'react-zoom-pan-pinch'
import { toast } from 'sonner'
import {
  Copy,
  Download,
  FileCode,
  Image as ImageIcon,
  Link2,
  RotateCcw,
  Trash2,
  Upload,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import type { FreeStyleTool } from '@/lib/tools/freestyle'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import {
  buildMermaidInkUrl,
  buildMermaidLiveUrl,
  encodeState,
  extractCode,
} from '@/lib/mermaid-pako'
import { cn } from '@/lib/utils'

interface MermaidConsoleProps {
  tool: FreeStyleTool
}

const mermaidId = 'mermaid-preview'

let initialized = false
function ensureMermaid() {
  if (initialized) return
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'strict',
  })
  initialized = true
}

async function renderMermaid(code: string): Promise<string> {
  ensureMermaid()
  const id = `${mermaidId}-${Math.random().toString(36).slice(2, 9)}`
  const { svg } = await mermaid.render(id, code)
  return svg
}

async function svgToPngBlob(svgStr: string, scale = 2): Promise<Blob> {
  const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  try {
    const img = new Image()
    img.src = url
    await img.decode()
    const { naturalWidth: w, naturalHeight: h } = img
    const canvas = document.createElement('canvas')
    canvas.width = w * scale
    canvas.height = h * scale
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context unavailable')
    ctx.scale(scale, scale)
    ctx.drawImage(img, 0, 0)
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Failed to encode PNG'))),
        'image/png',
      ),
    )
  } finally {
    URL.revokeObjectURL(url)
  }
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

function ZoomControls({
  controls,
  align = 'end',
}: {
  controls: ReactZoomPanPinchRef
  align?: 'start' | 'end'
}) {
  return (
    <div
      className={cn(
        'absolute bottom-4 z-10 flex gap-1 rounded-lg border bg-background/90 p-1 shadow-md backdrop-blur',
        align === 'end' ? 'right-4' : 'left-4',
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => controls.zoomIn()}
        title="Zoom in"
      >
        <ZoomIn className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => controls.zoomOut()}
        title="Zoom out"
      >
        <ZoomOut className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => controls.resetTransform()}
        title="Reset view"
      >
        <RotateCcw className="size-4" />
      </Button>
    </div>
  )
}

export function MermaidConsole({ tool }: MermaidConsoleProps) {
  const [code, setCode] = useState('')
  const [svg, setSvg] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [importOpen, setImportOpen] = useState(false)
  const [importInput, setImportInput] = useState('')
  const renderTokenRef = useRef(0)

  useEffect(() => {
    const token = ++renderTokenRef.current
    const trimmed = code.trim()
    if (!trimmed) {
      setSvg('')
      setError(null)
      return
    }
    const handle = setTimeout(async () => {
      try {
        const rendered = await renderMermaid(code)
        if (token !== renderTokenRef.current) return
        setSvg(rendered)
        setError(null)
      } catch (err) {
        if (token !== renderTokenRef.current) return
        setError(err instanceof Error ? err.message : String(err))
        setSvg('')
      }
    }, 300)
    return () => clearTimeout(handle)
  }, [code])

  const handleCopy = useCallback(async () => {
    if (!code) return
    try {
      await navigator.clipboard.writeText(code)
      toast.success('Copied diagram source to clipboard!')
    } catch {
      toast.error('Failed to copy')
    }
  }, [code])

  const handleClear = useCallback(() => {
    setCode('')
    setSvg('')
    setError(null)
  }, [])

  const handleExportPng = useCallback(async () => {
    if (!svg) return
    try {
      const blob = await svgToPngBlob(svg)
      triggerDownload(blob, 'mermaid-diagram.png')
      toast.success('Downloaded PNG')
    } catch (err) {
      toast.error(
        err instanceof Error ? `Failed to export PNG: ${err.message}` : 'Failed to export PNG',
      )
    }
  }, [svg])

  const handleExportSvg = useCallback(() => {
    if (!svg) return
    try {
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
      triggerDownload(blob, 'mermaid-diagram.svg')
      toast.success('Downloaded SVG')
    } catch {
      toast.error('Failed to export SVG')
    }
  }, [svg])

  const handleCopyImage = useCallback(async () => {
    if (!svg) return
    try {
      const blob = await svgToPngBlob(svg)
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ])
      toast.success('Copied image to clipboard!')
    } catch (err) {
      toast.error(
        err instanceof Error ? `Failed to copy image: ${err.message}` : 'Failed to copy image',
      )
    }
  }, [svg])

  const handleCopyPakoLive = useCallback(async () => {
    if (!code) return
    try {
      const fragment = encodeState({ code })
      const url = buildMermaidLiveUrl(fragment)
      await navigator.clipboard.writeText(url)
      toast.success('Copied mermaid.live URL!')
    } catch (err) {
      toast.error(
        err instanceof Error ? `Failed to encode: ${err.message}` : 'Failed to encode',
      )
    }
  }, [code])

  const handleCopyPakoInk = useCallback(async () => {
    if (!code) return
    try {
      const fragment = encodeState({ code })
      const url = buildMermaidInkUrl(fragment)
      await navigator.clipboard.writeText(url)
      toast.success('Copied mermaid.ink URL!')
    } catch (err) {
      toast.error(
        err instanceof Error ? `Failed to encode: ${err.message}` : 'Failed to encode',
      )
    }
  }, [code])

  const handleOpenImport = useCallback(() => {
    setImportInput('')
    setImportOpen(true)
  }, [])

  const handleImportSubmit = useCallback(() => {
    const trimmed = importInput.trim()
    if (!trimmed) return
    try {
      const next = extractCode(trimmed)
      setCode(next)
      setImportOpen(false)
      toast.success('Loaded diagram from pako URL')
    } catch (err) {
      toast.error(
        err instanceof Error ? `Failed to decode: ${err.message}` : 'Failed to decode',
      )
    }
  }, [importInput])

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 px-4 pb-24 md:pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{tool.name}</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleOpenImport}>
            <Upload className="size-4 mr-1" />
            Import Pako URL
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!code}>
            <Copy className="size-4 mr-1" />
            Copy
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClear} disabled={!code}>
            <Trash2 className="size-4 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      <div className="grid h-[calc(100vh-13rem)] min-h-[480px] grid-cols-1 gap-4 md:grid-cols-2">
        {/* Editor */}
        <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <span className="text-sm font-medium">Editor</span>
            <span className="text-xs text-muted-foreground">
              {code.length} chars
            </span>
          </div>
          <div className="min-h-0 flex-1">
            <Editor
              height="100%"
              language="markdown"
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val ?? '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
              }}
            />
          </div>
        </div>

        {/* Preview */}
        <div className="relative flex min-h-0 flex-col overflow-hidden rounded-lg border">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <span className="text-sm font-medium">Preview</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" disabled={!svg}>
                  <Download className="size-4 mr-1" />
                  Export
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-48 p-1">
                <button
                  type="button"
                  onClick={handleExportPng}
                  disabled={!svg}
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  <ImageIcon className="size-4" />
                  Export PNG
                </button>
                <button
                  type="button"
                  onClick={handleExportSvg}
                  disabled={!svg}
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  <FileCode className="size-4" />
                  Export SVG
                </button>
                <button
                  type="button"
                  onClick={handleCopyImage}
                  disabled={!svg}
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  <Copy className="size-4" />
                  Copy image
                </button>
                <div className="my-1 h-px bg-border" />
                <button
                  type="button"
                  onClick={handleCopyPakoLive}
                  disabled={!code}
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  <Link2 className="size-4" />
                  To mermaid.live
                </button>
                <button
                  type="button"
                  onClick={handleCopyPakoInk}
                  disabled={!code}
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  <Link2 className="size-4" />
                  To mermaid.ink
                </button>
              </PopoverContent>
            </Popover>
          </div>

          <div className="relative min-h-0 flex-1 bg-muted/30">
            {error ? (
              <div className="flex h-full items-center justify-center p-4">
                <pre className="max-h-full max-w-full overflow-auto rounded-md border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                  {error}
                </pre>
              </div>
            ) : svg ? (
              <TransformWrapper
                centerOnInit
                initialScale={0.8}
                minScale={0.1}
                maxScale={8}
              >
                {(controls: ReactZoomPanPinchRef) => (
                  <>
                    <ZoomControls controls={controls} />
                    <TransformComponent
                      wrapperClass="!h-full !w-full !cursor-grab active:!cursor-grabbing"
                      contentClass="!flex !items-center !justify-center"
                    >
                      <div
                        className="mermaid-svg [&>svg]:max-w-none [&>svg]:h-auto [&>svg]:w-auto"
                        dangerouslySetInnerHTML={{ __html: svg }}
                      />
                    </TransformComponent>
                  </>
                )}
              </TransformWrapper>
            ) : (
              <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
                Type Mermaid syntax on the left to see the rendered diagram here.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-center text-[10px] leading-tight text-muted-foreground md:text-xs">
        All rendering is performed client-side. Your diagram source never leaves
        your browser.
      </div>

      <Dialog
        open={importOpen}
        onOpenChange={(open) => {
          setImportOpen(open)
          if (!open) setImportInput('')
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import from Pako URL</DialogTitle>
            <DialogDescription>
              Paste a mermaid.live URL or a raw <code>pako:</code> fragment. The
              decoded diagram source will replace the current editor content.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            rows={6}
            placeholder="https://mermaid.live/edit#pako:eNp..."
            value={importInput}
            onChange={(e) => setImportInput(e.target.value)}
            className="font-mono text-xs"
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setImportOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImportSubmit} disabled={!importInput.trim()}>
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
