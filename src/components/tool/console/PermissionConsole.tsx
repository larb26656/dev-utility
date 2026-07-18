import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { Copy, Terminal } from 'lucide-react'
import type { FreeStyleTool } from '@/lib/tools/freestyle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

interface PermissionConsoleProps {
  tool: FreeStyleTool
}

interface PermissionState {
  owner: { read: boolean; write: boolean; execute: boolean }
  group: { read: boolean; write: boolean; execute: boolean }
  other: { read: boolean; write: boolean; execute: boolean }
}

function computeOctal(perms: PermissionState): string {
  const calc = (p: keyof PermissionState) => {
    let val = 0
    if (perms[p].read) val += 4
    if (perms[p].write) val += 2
    if (perms[p].execute) val += 1
    return val
  }
  return `${calc('owner')}${calc('group')}${calc('other')}`
}

function getPermissionBits(perms: PermissionState): string {
  const fmt = (p: keyof PermissionState) => {
    return (perms[p].read ? 'r' : '-') +
           (perms[p].write ? 'w' : '-') +
           (perms[p].execute ? 'x' : '-')
  }
  return `${fmt('owner')}${fmt('group')}${fmt('other')}`
}

function parseOctalToPerms(octal: string): PermissionState | null {
  const cleaned = octal.replace(/[^0-7]/g, '')
  if (cleaned.length !== 3) return null
  if (!/^[0-7]{3}$/.test(cleaned)) return null
  const digits = cleaned.split('').map(Number)
  const toRWX = (n: number) => ({
    read: n >= 4,
    write: (n % 4) >= 2,
    execute: (n % 2) === 1,
  })
  return {
    owner: toRWX(digits[0]),
    group: toRWX(digits[1]),
    other: toRWX(digits[2]),
  }
}

export function PermissionConsole({ tool }: PermissionConsoleProps) {
  const [perms, setPerms] = useState<PermissionState>({
    owner: { read: true, write: true, execute: true },
    group: { read: true, write: false, execute: true },
    other: { read: true, write: false, execute: false },
  })
  const [octalInput, setOctalInput] = useState('755')
  const [inputError, setInputError] = useState<string | null>(null)

  const octal = computeOctal(perms)
  const bits = getPermissionBits(perms)

  const handleChange = useCallback(
    (entity: keyof PermissionState, perm: keyof PermissionState['owner'], checked: boolean) => {
      setPerms((prev) => ({
        ...prev,
        [entity]: { ...prev[entity], [perm]: checked },
      }))
    },
    []
  )

  const handleCopyOctal = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(octal)
      toast.success('Copied octal permission!')
    } catch {
      toast.error('Failed to copy')
    }
  }, [octal])

  const handleCopyChmod = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`chmod ${octal}`)
      toast.success('Copied chmod command!')
    } catch {
      toast.error('Failed to copy')
    }
  }, [octal])

  const handleOctalInputChange = useCallback((value: string) => {
    setOctalInput(value)
    const parsed = parseOctalToPerms(value)
    if (parsed) {
      setPerms(parsed)
      setInputError(null)
    } else {
      setInputError('Invalid octal permission (use 0-7 for each digit)')
    }
  }, [])

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 px-4 pb-24 md:pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{tool.name}</h1>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">Permission Bits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 items-center">
            <Input
              type="text"
              placeholder="Enter octal (e.g. 755)"
              value={octalInput}
              onChange={(e) => handleOctalInputChange(e.target.value)}
              maxLength={3}
              className="w-24 text-center font-mono text-lg font-bold"
            />
            <span className="text-sm text-muted-foreground">Octal input</span>
          </div>
          {inputError && (
            <p className="text-sm text-destructive">{inputError}</p>
          )}

          <div className="grid grid-cols-4 gap-3 text-center text-sm">
            <div className="col-span-1" />
            <div className="col-span-1 font-medium text-muted-foreground">Read</div>
            <div className="col-span-1 font-medium text-muted-foreground">Write</div>
            <div className="col-span-1 font-medium text-muted-foreground">Execute</div>

            {(['owner', 'group', 'other'] as const).map((entity) => (
              <>
                <div
                  key={`label-${entity}`}
                  className="col-span-1 font-medium text-muted-foreground capitalize"
                >
                  {entity}
                </div>
                {(['read', 'write', 'execute'] as const).map((perm) => (
                  <div key={`${entity}-${perm}`} className="flex justify-center">
                    <Checkbox
                      checked={perms[entity][perm]}
                      onCheckedChange={(checked) =>
                        handleChange(entity, perm, !!checked)
                      }
                    />
                  </div>
                ))}
              </>
            ))}

            <div className="col-span-1 font-bold text-lg">Octal</div>
            <div className="col-span-3 font-bold text-2xl tabular-nums">{octal}</div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-muted/50 text-center">
            <p className="text-xs text-muted-foreground mb-1">Symbolic</p>
            <p className="font-mono text-lg tracking-wider">{bits}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">Command</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-black text-white font-mono text-lg">
            <Terminal className="size-5 shrink-0 text-green-400" />
            <span className="break-all">chmod {octal}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 gap-2" onClick={handleCopyChmod}>
              <Copy className="size-4" />
              Copy chmod
            </Button>
            <Button variant="outline" className="flex-1 gap-2" onClick={handleCopyOctal}>
              <Copy className="size-4" />
              Copy {octal}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-[10px] md:text-xs text-muted-foreground leading-tight px-2">
        All calculations are performed client-side. Your data never leaves your browser.
      </div>
    </div>
  )
}
