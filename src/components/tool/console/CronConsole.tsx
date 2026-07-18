import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Calendar, Clock, Copy, RefreshCw } from 'lucide-react'
import { CronExpressionParser } from 'cron-parser'
import type { FreeStyleTool } from '@/lib/tools/freestyle'
import type {CronParts} from '@/lib/cron';
import {
  
  buildCronExpression,
  getCronDescription,
  parseCronExpression,
  validateCronExpression
} from '@/lib/cron'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface CronConsoleProps {
  tool: FreeStyleTool
}

const MINUTE_OPTIONS = [
  { value: '*', label: 'Every minute' },
  { value: '0', label: 'At minute 0' },
  { value: '15', label: 'At minute 15' },
  { value: '30', label: 'At minute 30' },
  { value: '45', label: 'At minute 45' },
  { value: '0,30', label: 'At minute 0 and 30' },
  { value: '*/5', label: 'Every 5 minutes' },
  { value: '*/10', label: 'Every 10 minutes' },
  { value: '*/15', label: 'Every 15 minutes' },
  { value: '*/30', label: 'Every 30 minutes' },
]

const HOUR_OPTIONS = [
  { value: '*', label: 'Every hour' },
  { value: '0', label: 'At midnight (0)' },
  { value: '6', label: 'At 6 AM' },
  { value: '9', label: 'At 9 AM' },
  { value: '12', label: 'At noon (12)' },
  { value: '17', label: 'At 5 PM' },
  { value: '18', label: 'At 6 PM' },
  { value: '0,12', label: 'At midnight and noon' },
  { value: '9-17', label: 'Every hour from 9 AM to 5 PM' },
  { value: '*/2', label: 'Every 2 hours' },
  { value: '*/4', label: 'Every 4 hours' },
  { value: '*/6', label: 'Every 6 hours' },
]

const DAY_OF_MONTH_OPTIONS = [
  { value: '*', label: 'Every day' },
  { value: '1', label: 'On the 1st' },
  { value: '15', label: 'On the 15th' },
  { value: '1,15', label: 'On the 1st and 15th' },
  { value: '1-15', label: 'From 1st to 15th' },
  { value: '*/5', label: 'Every 5 days' },
  { value: '*/10', label: 'Every 10 days' },
]

const MONTH_OPTIONS = [
  { value: '*', label: 'Every month' },
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
  { value: '1,4,7,10', label: 'Quarterly (Jan, Apr, Jul, Oct)' },
  { value: '*/3', label: 'Every 3 months' },
  { value: '*/6', label: 'Every 6 months' },
]

const DAY_OF_WEEK_OPTIONS = [
  { value: '*', label: 'Every day' },
  { value: '1-5', label: 'Weekdays (Mon-Fri)' },
  { value: '0,6', label: 'Weekends (Sat, Sun)' },
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' },
  { value: '0', label: 'Sunday' },
  { value: '1,3,5', label: 'Mon, Wed, Fri' },
  { value: '2,4', label: 'Tue, Thu' },
]

const PRESETS = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every 5 minutes', value: '*/5 * * * *' },
  { label: 'Every 15 minutes', value: '*/15 * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Every day at midnight', value: '0 0 * * *' },
  { label: 'Every day at 9 AM', value: '0 9 * * *' },
  { label: 'Every Monday at 9 AM', value: '0 9 * * 1' },
  { label: 'First day of month at midnight', value: '0 0 1 * *' },
  { label: 'Every weekday at 9 AM', value: '0 9 * * 1-5' },
  { label: 'Every quarter at midnight', value: '0 0 1 1,4,7,10 *' },
]

const DEFAULT_CRON: CronParts = {
  minute: '0',
  hour: '9',
  dayOfMonth: '*',
  month: '*',
  dayOfWeek: '*',
}

function getNextRuns(expression: string, count: number = 5): Array<string> {
  try {
    const interval = CronExpressionParser.parse(expression)
    const runs: Array<string> = []
    for (let i = 0; i < count; i++) {
      const next = interval.next()
      runs.push(next.toDate().toLocaleString())
    }
    return runs
  } catch {
    return []
  }
}

export function CronConsole({ tool }: CronConsoleProps) {
  const [activeTab, setActiveTab] = useState('visual')
  const [rawExpression, setRawExpression] = useState('0 9 * * *')
  const [cronPart, setCronPart] = useState<CronParts>(DEFAULT_CRON)
  const [expressionError, setExpressionError] = useState<string | null>(null)

  const expression = useMemo(() => {
    if (activeTab === 'raw') {
      return rawExpression
    }
    return buildCronExpression(cronPart)
  }, [activeTab, rawExpression, cronPart])

  const isValid = useMemo(() => validateCronExpression(expression), [expression])

  const description = useMemo(() => {
    if (!isValid) return 'Invalid expression'
    return getCronDescription(expression)
  }, [expression, isValid])

  const nextRuns = useMemo(() => {
    if (!isValid) return []
    return getNextRuns(expression, 5)
  }, [expression, isValid])

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value)
    if (value === 'raw') {
      setRawExpression(buildCronExpression(cronPart))
    } else {
      const parsed = parseCronExpression(rawExpression)
      if (parsed) {
        setCronPart(parsed)
      }
    }
  }, [cronPart, rawExpression])

  const handleRawExpressionChange = useCallback((value: string) => {
    setRawExpression(value)
    const parsed = parseCronExpression(value)
    if (parsed) {
      setCronPart(parsed)
      setExpressionError(null)
    } else if (value.trim() !== '') {
      setExpressionError('Invalid cron expression format')
    }
  }, [])

  const handleCronPartChange = useCallback((field: keyof CronParts, value: string) => {
    setCronPart((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handlePresetSelect = useCallback((value: string) => {
    setRawExpression(value)
    const parsed = parseCronExpression(value)
    if (parsed) {
      setCronPart(parsed)
      setExpressionError(null)
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
    setCronPart(DEFAULT_CRON)
    setRawExpression('0 9 * * *')
    setExpressionError(null)
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 px-4 pb-24 md:pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{tool.name}</h1>
        <Button variant="ghost" size="sm" onClick={handleClear}>
          <RefreshCw className="size-4 mr-1" />
          Reset
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="visual">
            <Calendar className="size-4 mr-1" />
            Visual Builder
          </TabsTrigger>
          <TabsTrigger value="raw">
            <Clock className="size-4 mr-1" />
            Raw Expression
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Build Your Cron Expression</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Minute</Label>
                  <Select
                    value={cronPart.minute}
                    onValueChange={(v) => handleCronPartChange('minute', v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Minute</SelectLabel>
                        {MINUTE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Hour</Label>
                  <Select
                    value={cronPart.hour}
                    onValueChange={(v) => handleCronPartChange('hour', v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Hour</SelectLabel>
                        {HOUR_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Day of Month</Label>
                  <Select
                    value={cronPart.dayOfMonth}
                    onValueChange={(v) => handleCronPartChange('dayOfMonth', v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Day of Month</SelectLabel>
                        {DAY_OF_MONTH_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Month</Label>
                  <Select
                    value={cronPart.month}
                    onValueChange={(v) => handleCronPartChange('month', v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Month</SelectLabel>
                        {MONTH_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Day of Week</Label>
                  <Select
                    value={cronPart.dayOfWeek}
                    onValueChange={(v) => handleCronPartChange('dayOfWeek', v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Day of Week</SelectLabel>
                        {DAY_OF_WEEK_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="raw" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Enter Cron Expression</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Cron Expression</Label>
                <Input
                  value={rawExpression}
                  onChange={(e) => handleRawExpressionChange(e.target.value)}
                  placeholder="* * * * *"
                  className="font-mono text-lg text-center"
                />
                {expressionError && (
                  <p className="text-sm text-destructive">{expressionError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Quick Presets</Label>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.slice(0, 6).map((preset) => (
                    <Button
                      key={preset.value}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePresetSelect(preset.value)}
                      className="font-mono text-xs"
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Expression Result</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(expression)}
              className="font-mono"
            >
              <Copy className="size-4 mr-1" />
              Copy
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted">
            <code className="text-2xl font-mono font-bold break-all">
              {expression}
            </code>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Description</Label>
            <p className={`text-lg ${isValid ? '' : 'text-destructive'}`}>
              {description}
            </p>
          </div>

          {!isValid && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">
                Invalid cron expression. Please check the format.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {isValid && nextRuns.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Next 5 Execution Times</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {nextRuns.map((run, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <span className="text-sm font-medium text-muted-foreground">
                    #{index + 1}
                  </span>
                  <code className="font-mono text-sm">{run}</code>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-center text-[10px] md:text-xs text-muted-foreground leading-tight px-2">
        All cron calculations are performed client-side. Your data never leaves your browser.
      </div>
    </div>
  )
}