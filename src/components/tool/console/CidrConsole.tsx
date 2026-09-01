import { useCallback, useMemo, useState } from 'react'
import { Copy, Network, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import type { FreeStyleTool } from '@/lib/tools/freestyle'
import type {Ipv4CidrInfo} from '@/lib/cidrUtils';
import {
  
  formatNumber,
  parseIpv4Cidr,
  typeBadgeClass
} from '@/lib/cidrUtils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface CidrConsoleProps {
  tool: FreeStyleTool
}

const PRESETS: ReadonlyArray<string> = [
  '192.1.168.0/24',
  '192.168.0.0/24',
  '10.0.0.0/8',
  '172.16.0.0/12',
  '127.0.0.0/8',
  '169.254.0.0/16',
  '0.0.0.0/0',
  '192.168.1.0/30',
  '10.0.0.0/31',
  '203.0.113.0/24',
]

const DEFAULT_INPUT = '192.1.168.0/24'

interface CopyableRowProps {
  label: string
  value: string
}

function CopyableRow({ label, value }: CopyableRowProps) {
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)
      toast.success(`Copied ${label}`)
    } catch {
      toast.error('Failed to copy')
    }
  }, [label, value])

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 px-3 py-2 group">
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="font-mono text-sm break-all">{value}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-7 shrink-0 opacity-60 hover:opacity-100"
        onClick={handleCopy}
        aria-label={`Copy ${label}`}
      >
        <Copy className="size-3.5" />
      </Button>
    </div>
  )
}

function BinaryVisualization({ info }: { info: Ipv4CidrInfo }) {
  const { binary, cidr, ipClass } = info

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>32-bit binary — class {ipClass}</span>
        <span>
          Prefix /{cidr} • {cidr} network bits • {32 - cidr} host bits
        </span>
      </div>
      <div className="space-y-1.5 font-mono text-sm">
        {binary.octets.map((octet, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="w-6 text-right text-xs text-muted-foreground">
              {idx + 1}
            </span>
            <div className="flex-1 flex gap-0.5">
              {Array.from({ length: 8 }).map((_, bitIdx) => {
                const isNetwork = bitIdx < octet.network.length
                const isFirstHost =
                  !isNetwork && bitIdx === octet.network.length && idx * 8 + bitIdx === cidr
                return (
                  <span
                    key={bitIdx}
                    className={cn(
                      'flex-1 text-center rounded py-0.5 text-xs',
                      isNetwork
                        ? 'bg-primary/20 text-primary font-bold'
                        : 'bg-muted text-muted-foreground',
                      isFirstHost && 'ring-1 ring-primary',
                    )}
                  >
                    {isNetwork
                      ? octet.network[bitIdx]
                      : octet.host[bitIdx - octet.network.length]}
                  </span>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded bg-primary/20 ring-1 ring-primary/40" />
          Network ({cidr} bits)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded bg-muted ring-1 ring-border" />
          Host ({32 - cidr} bits)
        </span>
      </div>
    </div>
  )
}

export function CidrConsole({ tool }: CidrConsoleProps) {
  const [input, setInput] = useState(DEFAULT_INPUT)

  const result = useMemo(() => parseIpv4Cidr(input), [input])

  const handleReset = useCallback(() => {
    setInput(DEFAULT_INPUT)
  }, [])

  const handlePreset = useCallback((preset: string) => {
    setInput(preset)
  }, [])

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 px-4 pb-24 md:pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{tool.name}</h1>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RefreshCw className="size-4 mr-1" />
          Reset
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Network className="size-4" />
            CIDR Input
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. 192.1.168.0/24"
            className="font-mono text-lg"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePreset(preset)}
                className={cn(
                  'text-xs font-mono px-2 py-1 rounded border transition-colors',
                  'bg-background hover:bg-muted text-muted-foreground hover:text-foreground',
                  'border-border',
                )}
              >
                {preset}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {result.ok === false && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-destructive">
              {result.error}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Use dotted-quad notation followed by /prefix (0-32). Example:{' '}
              <code className="font-mono">192.1.168.0/24</code>
            </p>
          </CardContent>
        </Card>
      )}

      {result.ok && <Ipv4Results info={result.info} />}

      <div className="text-center text-[10px] md:text-xs text-muted-foreground leading-tight px-2">
        All calculations are performed client-side. Your input never leaves
        your browser.
      </div>
    </div>
  )
}

function Ipv4Results({ info }: { info: Ipv4CidrInfo }) {
  const usableText =
    info.firstUsable && info.lastUsable
      ? `${info.firstUsable} – ${info.lastUsable}`
      : info.firstUsable
        ? info.firstUsable
        : info.lastUsable
          ? info.lastUsable
          : 'N/A (single host)'

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">
            Network
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <CopyableRow label="CIDR" value={info.input} />
          <CopyableRow label="Prefix length" value={`/${info.cidr}`} />
          <CopyableRow label="Subnet mask" value={info.subnetMask} />
          <CopyableRow label="Wildcard mask" value={info.wildcardMask} />
          <CopyableRow label="Network address" value={info.network} />
          <CopyableRow label="Broadcast address" value={info.broadcast} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Host Range</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <CopyableRow label="Usable range" value={usableText} />
          <CopyableRow
            label="Usable hosts"
            value={formatNumber(info.usableHosts)}
          />
          <CopyableRow
            label="Total addresses"
            value={formatNumber(info.totalAddresses)}
          />
          <CopyableRow label="First usable" value={info.firstUsable ?? 'N/A'} />
          <CopyableRow label="Last usable" value={info.lastUsable ?? 'N/A'} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Properties</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              IP Class
            </span>
            <span className="inline-flex items-center justify-center size-12 rounded-md border bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 font-mono text-xl font-bold">
              {info.ipClass}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              Type
            </span>
            <span
              className={cn(
                'inline-flex items-center px-3 py-2 rounded-md border text-sm font-medium',
                typeBadgeClass(info.type),
              )}
            >
              {info.type}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">
            Binary Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BinaryVisualization info={info} />
        </CardContent>
      </Card>
    </>
  )
}