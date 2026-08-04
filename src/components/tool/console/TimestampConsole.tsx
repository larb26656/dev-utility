import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { Calendar, Clock, Copy, RefreshCw } from 'lucide-react'
import type { FreeStyleTool } from '@/lib/tools/freestyle'
import type {TimezoneId} from '@/lib/timestampUtils';
import {
  TIMEZONES,
  
  formatDate,
  formatISOWithOffset,
  formatTimestamp,
  getOffsetForDate
} from '@/lib/timestampUtils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface TimestampConsoleProps {
  tool: FreeStyleTool
}

interface OutputFormat {
  label: string
  value: string
}

function computeOutputs(date: Date, timezone: TimezoneId): Array<OutputFormat> {
  const ts = formatTimestamp(date)
  const human = formatDate(date, timezone)
  const isoWithOffset = formatISOWithOffset(date, timezone)
  return [
    { label: 'Human Readable', value: human },
    { label: 'Timestamp (ms)', value: String(ts.ms) },
    { label: 'Timestamp (s)', value: String(ts.s) },
    { label: 'ISO 8601 (UTC)', value: date.toISOString() },
    { label: 'ISO 8601 (with offset)', value: isoWithOffset },
    toJson(date, timezone),
  ]
}

function toJson(date: Date, tz: TimezoneId): OutputFormat {
  const ts = formatTimestamp(date)
  return {
    label: 'JSON',
    value: JSON.stringify(
      {
        unix: ts.s,
        unixMs: ts.ms,
        iso: date.toISOString(),
        human: formatDate(date, tz),
        timezone:
          tz === 'local'
            ? Intl.DateTimeFormat().resolvedOptions().timeZone
            : tz,
        offset: getOffsetForDate(date, tz),
      },
      null,
      2,
    ),
  }
}

export function TimestampConsole({ tool }: TimestampConsoleProps) {
  const [timezone, setTimezone] = useState<TimezoneId>('local')
  const [inputMode, setInputMode] = useState<'picker' | 'timestamp'>('picker')
  const [dateTimeInput, setDateTimeInput] = useState('')
  const [timestampInput, setTimestampInput] = useState('')
  const [outputs, setOutputs] = useState<Array<OutputFormat>>([])

  const parseTimestamp = useCallback((value: string): Date | null => {
    const trimmed = value.trim()
    if (!trimmed) return null

    const num = Number(trimmed)

    if (isNaN(num)) {
      const parsed = new Date(trimmed)
      if (isNaN(parsed.getTime())) return null
      return parsed
    }

    if (num > 1e12) {
      return new Date(num)
    } else {
      return new Date(num * 1000)
    }
  }, [])

  const handleDateTimeChange = useCallback(
    (value: string) => {
      setDateTimeInput(value)

      if (!value) {
        setOutputs([])
        return
      }

      const date = new Date(value)
      if (isNaN(date.getTime())) {
        setOutputs([])
        return
      }

      setOutputs(computeOutputs(date, timezone))
    },
    [timezone],
  )

  const handleTimestampChange = useCallback(
    (value: string) => {
      setTimestampInput(value)

      if (!value.trim()) {
        setOutputs([])
        return
      }

      const date = parseTimestamp(value)
      if (!date) {
        setOutputs([{ label: 'Error', value: 'Invalid timestamp or date format' }])
        return
      }

      setOutputs(computeOutputs(date, timezone))
    },
    [timezone, parseTimestamp],
  )

  const handleTimezoneChange = useCallback(
    (tz: TimezoneId) => {
      setTimezone(tz)

      if (outputs.length > 0 && !outputs[0].label.includes('Error')) {
        let date: Date | null = null
        if (inputMode === 'picker' && dateTimeInput) {
          date = new Date(dateTimeInput)
        } else if (inputMode === 'timestamp' && timestampInput) {
          date = parseTimestamp(timestampInput)
        }
        if (date) {
          setOutputs(computeOutputs(date, tz))
        }
      }
    },
    [dateTimeInput, timestampInput, inputMode, outputs, parseTimestamp],
  )

  const handleCopy = useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      toast.success('Copied to clipboard!')
    } catch {
      toast.error('Failed to copy')
    }
  }, [])

  const handleClear = useCallback(() => {
    setDateTimeInput('')
    setTimestampInput('')
    setOutputs([])
  }, [])

  const handleNow = useCallback(() => {
    const now = new Date()
    const localDatetime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
    setDateTimeInput(localDatetime)
    handleDateTimeChange(localDatetime)
  }, [handleDateTimeChange])

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 px-4 pb-24 md:pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{tool.name}</h1>
        <Select
          value={timezone}
          onValueChange={(v) => handleTimezoneChange(v)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Timezone" />
          </SelectTrigger>
          <SelectContent>
            {TIMEZONES.map((tz) => (
              <SelectItem key={tz.id} value={tz.id}>
                {tz.id === 'local'
                  ? tz.label
                  : `${tz.label} (${getOffsetForDate(new Date(), tz.id)})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs
        value={inputMode}
        onValueChange={(v) => setInputMode(v as 'picker' | 'timestamp')}
      >
        <TabsList className="w-full">
          <TabsTrigger value="picker" className="flex-1 gap-2">
            <Calendar className="size-4" />
            Date Picker
          </TabsTrigger>
          <TabsTrigger value="timestamp" className="flex-1 gap-2">
            <Clock className="size-4" />
            Timestamp
          </TabsTrigger>
        </TabsList>

        <TabsContent value="picker" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <Input
                  type="datetime-local"
                  value={dateTimeInput}
                  onChange={(e) => handleDateTimeChange(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNow}
                  title="Now"
                >
                  <Clock className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timestamp" className="mt-4">
          <Card>
            <CardContent className="pt-6 space-y-2">
              <Input
                type="text"
                placeholder="Enter timestamp (ms: 1721289000000, s: 1721289000) or ISO date string..."
                value={timestampInput}
                onChange={(e) => handleTimestampChange(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Supports: Unix timestamp in milliseconds or seconds, ISO 8601 string
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {outputs.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">Output</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <RefreshCw className="size-4 mr-1" />
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {outputs.map((output, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    {output.label}
                  </p>
                  <pre className="text-sm font-mono break-all whitespace-pre-wrap">
                    {output.value}
                  </pre>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  onClick={() => handleCopy(output.value)}
                >
                  <Copy className="size-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="text-center text-[10px] md:text-xs text-muted-foreground leading-tight px-2">
        All conversions are performed client-side. Your data never leaves your
        browser.
      </div>
    </div>
  )
}
