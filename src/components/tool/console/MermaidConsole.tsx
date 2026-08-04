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
  Maximize2,
  Minimize2,
  RotateCcw,
  Trash2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import type {ReactZoomPanPinchRef} from 'react-zoom-pan-pinch';
import type { FreeStyleTool } from '@/lib/tools/freestyle'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
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
  const [isFullscreen, setIsFullscreen] = useState(false)
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

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 px-4 pb-24 md:pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{tool.name}</h1>
        <div className="flex gap-2">
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(true)}
              disabled={!svg}
            >
              <Maximize2 className="size-4 mr-1" />
              Fullscreen
            </Button>
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

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent
          className="inset-0 h-screen w-screen max-w-none translate-x-0 translate-y-0 gap-0 overflow-hidden rounded-none border-none p-0"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Mermaid Diagram</DialogTitle>
          <DialogDescription className="sr-only">
            Fullscreen Mermaid diagram preview with pan and zoom.
          </DialogDescription>

          <div className="flex h-screen w-screen flex-col bg-background">
            <div className="flex items-center justify-between border-b px-4 py-2">
              <span className="text-sm font-medium">{tool.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(false)}
              >
                <Minimize2 className="size-4 mr-1" />
                Exit Fullscreen
              </Button>
            </div>

            <div className="relative min-h-0 flex-1 bg-muted/20">
              {svg ? (
                <TransformWrapper
                  centerOnInit
                  initialScale={0.7}
                  minScale={0.05}
                  maxScale={12}
                >
                  {(controls: ReactZoomPanPinchRef) => (
                    <>
                      <ZoomControls controls={controls} align="start" />
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
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Nothing to display.
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="text-center text-[10px] leading-tight text-muted-foreground md:text-xs">
        All rendering is performed client-side. Your diagram source never leaves
        your browser.
      </div>
    </div>
  )
}
