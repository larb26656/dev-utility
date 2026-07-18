import { useCallback, useMemo, useState } from 'react'
import {
  HexColorPicker,
  HslStringColorPicker,
  HslaStringColorPicker,
  RgbStringColorPicker,
  RgbaStringColorPicker,
} from 'react-colorful'
import { toast } from 'sonner'
import { Copy, RefreshCw } from 'lucide-react'
import type { FreeStyleTool } from '@/lib/tools/freestyle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

interface ColorConsoleProps {
  tool: FreeStyleTool
}

interface OutputFormat {
  label: string
  value: string
}

function hexToRgba(hex: string): { r: number; g: number; b: number; a: number } | null {
  const clean = hex.replace('#', '')
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16)
    const g = parseInt(clean[1] + clean[1], 16)
    const b = parseInt(clean[2] + clean[2], 16)
    return { r, g, b, a: 1 }
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16)
    const g = parseInt(clean.slice(2, 4), 16)
    const b = parseInt(clean.slice(4, 6), 16)
    return { r, g, b, a: 1 }
  }
  if (clean.length === 8) {
    const r = parseInt(clean.slice(0, 2), 16)
    const g = parseInt(clean.slice(2, 4), 16)
    const b = parseInt(clean.slice(4, 6), 16)
    const a = parseInt(clean.slice(6, 8), 16) / 255
    return { r, g, b, a }
  }
  return null
}

function hexToOklch(hex: string): { l: number; c: number; h: number } | null {
  const rgba = hexToRgba(hex)
  if (!rgba) return null

  const rLin = srgbToLinear(rgba.r / 255)
  const gLin = srgbToLinear(rgba.g / 255)
  const bLin = srgbToLinear(rgba.b / 255)

  const l = 0.4122214708 * rLin + 0.5363325363 * gLin + 0.0514459929 * bLin
  const m = 0.2119034982 * rLin + 0.6806995451 * gLin + 0.1073969566 * bLin
  const s = 0.0883024619 * rLin + 0.2817188376 * gLin + 0.6299787005 * bLin

  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
  const bChroma = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_

  const C = Math.sqrt(a * a + bChroma * bChroma)
  let H = Math.atan2(bChroma, a) * (180 / Math.PI)
  if (H < 0) H += 360

  return {
    l: Math.round(L * 100 * 10) / 10,
    c: Math.round(C * 100 * 10) / 10,
    h: Math.round(H * 10) / 10,
  }
}

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rNorm = r / 255
  const gNorm = g / 255
  const bNorm = b / 255

  const max = Math.max(rNorm, gNorm, bNorm)
  const min = Math.min(rNorm, gNorm, bNorm)
  const delta = max - min

  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)

    if (max === rNorm) {
      h = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) / 6
    } else if (max === gNorm) {
      h = ((bNorm - rNorm) / delta + 2) / 6
    } else {
      h = ((rNorm - gNorm) / delta + 4) / 6
    }
  }

  return {
    h: Math.round(h * 360),
    s: clamp(Math.round(s * 100), 0, 100),
    l: clamp(Math.round(l * 100), 0, 100),
  }
}

type PickerMode = 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla'

export function ColorConsole({ tool }: ColorConsoleProps) {
  const [color, setColor] = useState('#3b82f6')
  const [pickerMode, setPickerMode] = useState<PickerMode>('hex')
  const [hexInput, setHexInput] = useState('#3b82f6')

  const rgba = useMemo(() => hexToRgba(color), [color])
  const oklch = useMemo(() => hexToOklch(color), [color])

  const outputs: Array<OutputFormat> = useMemo(() => {
    if (!rgba) return []

    const { r, g, b, a } = rgba
    const hsl = rgbToHsl(r, g, b)
    const formats: Array<OutputFormat> = [
      { label: 'HEX', value: color },
      { label: 'HEX8', value: `${color}${Math.round(a * 255).toString(16).padStart(2, '0')}` },
      { label: 'RGB', value: `rgb(${r}, ${g}, ${b})` },
      { label: 'RGBA', value: `rgba(${r}, ${g}, ${b}, ${Math.round(a * 100) / 100})` },
      { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
      { label: 'HSLA', value: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${Math.round(a * 100) / 100})` },
    ]

    if (oklch) {
      formats.push({ label: 'OKLCH', value: `oklch(${oklch.l}% ${oklch.c} ${oklch.h})` })
      formats.push({ label: 'OKLCHA', value: `oklch(${oklch.l}% ${oklch.c} ${oklch.h} / ${Math.round(a * 100) / 100})` })
    }

    return formats
  }, [color, rgba, oklch])

  const handleColorChange = useCallback((newColor: string) => {
    setColor(newColor)
    setHexInput(newColor)
  }, [])

  const handleHexInputChange = useCallback((value: string) => {
    setHexInput(value)
    if (value.match(/^#[0-9a-fA-F]{6}$/) || value.match(/^#[0-9a-fA-F]{3}$/)) {
      setColor(value)
    }
  }, [])

  const handleCopy = useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      toast.success('Copied to clipboard!')
    } catch {
      toast.error('Failed to copy')
    }
  }, [])

  const handleClear = useCallback(() => {
    setColor('#3b82f6')
    setHexInput('#3b82f6')
  }, [])

  const pickerComponent = useMemo(() => {
    const props = { color, onChange: handleColorChange }

    switch (pickerMode) {
      case 'hex':
        return <HexColorPicker {...props} />
      case 'rgb':
        return <RgbStringColorPicker {...props} />
      case 'rgba':
        return <RgbaStringColorPicker {...props} />
      case 'hsl':
        return <HslStringColorPicker {...props} />
      case 'hsla':
        return <HslaStringColorPicker {...props} />
      default:
        return <HexColorPicker {...props} />
    }
  }, [pickerMode, color, handleColorChange])

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 px-4 pb-24 md:pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{tool.name}</h1>
        <Button variant="ghost" size="sm" onClick={handleClear}>
          <RefreshCw className="size-4 mr-1" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Color Picker</CardTitle>
                <select
                  value={pickerMode}
                  onChange={(e) => setPickerMode(e.target.value as PickerMode)}
                  className="text-xs border rounded px-2 py-1 bg-background"
                >
                  <option value="hex">HEX</option>
                  <option value="rgb">RGB</option>
                  <option value="rgba">RGBA</option>
                  <option value="hsl">HSL</option>
                  <option value="hsla">HSLA</option>
                </select>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="react-colorful">{pickerComponent}</div>

              <div className="w-full mt-4 space-y-3">
                <div>
                  <Label className="text-muted-foreground text-xs">HEX Input</Label>
                  <Input
                    value={hexInput}
                    onChange={(e) => handleHexInputChange(e.target.value)}
                    className="font-mono mt-1"
                    placeholder="#000000"
                  />
                </div>

                <div
                  className="w-full h-16 rounded-lg border shadow-inner"
                  style={{ backgroundColor: color }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">All Formats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {outputs.map((output) => (
                <div
                  key={output.label}
                  className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 group"
                >
                  <span className="w-24 text-xs font-medium text-muted-foreground shrink-0">
                    {output.label}
                  </span>
                  <code className="flex-1 text-sm font-mono truncate">{output.value}</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    onClick={() => handleCopy(output.value)}
                  >
                    <Copy className="size-3" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-center text-[10px] md:text-xs text-muted-foreground leading-tight px-2">
        All color conversions are performed client-side. Your data never leaves your browser.
      </div>
    </div>
  )
}
