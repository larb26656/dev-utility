import {
  Anchor,
  ChevronDown,
  Compass,
  Copy,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Waves,
} from 'lucide-react'
import { toast } from 'sonner'
import { useCallback, useMemo, useState } from 'react'
import type { FreeStyleTool } from '@/lib/tools/freestyle'
import type { SatirLevel, SatirLevels } from '@/stores/satirStore'
import { useSatirStore } from '@/stores/satirStore'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
  SATIR_SUGGESTIONS,
  appendSuggestion,
  hasSuggestions,
} from '@/lib/extensions/tools/productivity/satirSuggestions'

interface SatirConsoleProps {
  tool: FreeStyleTool
}

interface LevelConfig {
  id: SatirLevel
  depth: number
  title: string
  english: string
  prompt: string
  surface: string
  ring: string
  bar: string
  text: string
  icon: React.ComponentType<{ className?: string }>
}

const LEVELS: ReadonlyArray<LevelConfig> = [
  {
    id: 'behavior',
    depth: 1,
    title: 'พฤติกรรม',
    english: 'Behavior',
    prompt: 'คุณทำอะไรไป? คนรอบข้างเห็น/ได้ยินอะไรจากคุณ?',
    surface: 'bg-sky-50/60 dark:bg-sky-950/20',
    ring: 'ring-sky-400/40 border-sky-300/50',
    bar: 'bg-sky-300',
    text: 'text-sky-700 dark:text-sky-300',
    icon: Waves,
  },
  {
    id: 'coping',
    depth: 2,
    title: 'วิธีรับมือ',
    english: 'Coping',
    prompt:
      'คุณเล่าเรื่องนี้ให้ตัวเองหรือคนอื่นฟังว่าอย่างไร? มีเหตุผล/ข้อแก้ตัวอะไรที่ใช้?',
    surface: 'bg-cyan-50/60 dark:bg-cyan-950/25',
    ring: 'ring-cyan-400/40 border-cyan-300/50',
    bar: 'bg-cyan-400',
    text: 'text-cyan-700 dark:text-cyan-300',
    icon: Compass,
  },
  {
    id: 'feelings',
    depth: 3,
    title: 'ความรู้สึก',
    english: 'Feelings',
    prompt: 'ใต้เรื่องเล่า คุณรู้สึกอะไรจริงๆ? ร่างกายตอบสนองอย่างไร?',
    surface: 'bg-blue-50/60 dark:bg-blue-950/30',
    ring: 'ring-blue-400/40 border-blue-400/50',
    bar: 'bg-blue-500',
    text: 'text-blue-700 dark:text-blue-300',
    icon: Sparkles,
  },
  {
    id: 'perceptions',
    depth: 4,
    title: 'ความเชื่อ',
    english: 'Perceptions & Beliefs',
    prompt:
      'คุณเชื่อว่าตัวเอง / คนอื่น / โลก / สถานการณ์นี้ เป็นอย่างไร? มีกฎอะไรซ่อนอยู่?',
    surface: 'bg-indigo-50/60 dark:bg-indigo-950/30',
    ring: 'ring-indigo-400/40 border-indigo-400/50',
    bar: 'bg-indigo-500',
    text: 'text-indigo-700 dark:text-indigo-300',
    icon: Compass,
  },
  {
    id: 'yearning',
    depth: 5,
    title: 'ปรารถนาลึก',
    english: 'Yearning / Self',
    prompt:
      'ถ้าไม่มีข้อจำกัดใดๆ สิ่งที่คุณต้องการจริงๆ ลึกที่สุดในสถานการณ์นี้คืออะไร?',
    surface: 'bg-slate-100/60 dark:bg-slate-900/40',
    ring: 'ring-slate-500/40 border-slate-500/50',
    bar: 'bg-slate-700',
    text: 'text-slate-700 dark:text-slate-300',
    icon: Anchor,
  },
]

const DEPTH_RANGE = { min: 1, max: 5 }

export function isLevelComplete(levels: SatirLevels): boolean {
  return LEVELS.every((l) => levels[l.id].trim().length > 0)
}

export function buildMarkdown(
  scenario: string,
  levels: SatirLevels,
  date: Date = new Date(),
): string {
  const heading = `# Satir Iceberg Reflection — ${date.toISOString().slice(0, 10)}`
  const scenarioBlock = `## Scenario\n\n${scenario.trim() || '_(empty)_'}\n`
  const levelBlocks = LEVELS.map(
    (l) =>
      `## ${l.depth}. ${l.english} — ${l.title}\n\n${levels[l.id].trim() || '_(empty)_'}\n`,
  ).join('\n')
  return [heading, scenarioBlock, levelBlocks].join('\n')
}

interface LevelCardProps {
  config: LevelConfig
  value: string
  onChange: (value: string) => void
}

interface SuggestionChipProps {
  label: string
  variant: 'word' | 'prompt'
  textClass: string
  onPick: (value: string) => void
}

function SuggestionChip({
  label,
  variant,
  textClass,
  onPick,
}: SuggestionChipProps) {
  return (
    <button
      type="button"
      onClick={() => onPick(label)}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors text-left',
        'border-border bg-background hover:bg-accent hover:text-accent-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        variant === 'prompt' && cn('italic', textClass),
      )}
    >
      {variant === 'prompt' ? (
        <Lightbulb className="size-3 shrink-0 opacity-70" />
      ) : null}
      <span className="break-words">{label}</span>
    </button>
  )
}

interface SuggestionPopoverProps {
  level: SatirLevel
  textClass: string
  onPick: (value: string) => void
}

function SuggestionPopover({
  level,
  textClass,
  onPick,
}: SuggestionPopoverProps) {
  const set = SATIR_SUGGESTIONS[level]
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`คำแนะนำสำหรับ ${level}`}
          title="คำแนะนำ / ตัวอย่าง"
          className={cn('shrink-0', textClass)}
        >
          <Lightbulb className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-80 max-h-[60vh] overflow-y-auto"
      >
        <PopoverHeader>
          <PopoverTitle className="flex items-center gap-2">
            <Lightbulb className="size-4" /> คำแนะนำ / ตัวอย่าง
          </PopoverTitle>
          <PopoverDescription>
            คลิก chip เพื่อเพิ่มเข้า reflection ของคุณ
          </PopoverDescription>
        </PopoverHeader>
        <div className="mt-3 space-y-3">
          {set.groups.map((group) => (
            <div key={group.title} className="space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {group.title}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <SuggestionChip
                    key={item}
                    label={item}
                    variant="word"
                    textClass={textClass}
                    onPick={onPick}
                  />
                ))}
              </div>
            </div>
          ))}
          {set.prompts && set.prompts.length > 0 ? (
            <>
              <Separator />
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  คำถามชวนคิด
                </div>
                <div className="flex flex-col gap-1.5">
                  {set.prompts.map((prompt) => (
                    <SuggestionChip
                      key={prompt}
                      label={prompt}
                      variant="prompt"
                      textClass={textClass}
                      onPick={onPick}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function LevelCard({ config, value, onChange }: LevelCardProps) {
  const [open, setOpen] = useState(true)
  const Icon = config.icon
  const filled = value.trim().length > 0
  const showSuggestions = hasSuggestions(config.id)

  const handlePick = useCallback(
    (picked: string) => {
      onChange(appendSuggestion(value, picked))
    },
    [value, onChange],
  )

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card
        className={cn(
          'transition-all border',
          config.surface,
          filled && cn('ring-1', config.ring),
        )}
      >
        <CardHeader className="rounded-t-xl pb-3">
          <div className="flex items-start gap-2 w-full">
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex items-start gap-3 flex-1 min-w-0 text-left cursor-pointer rounded-md hover:bg-accent/30 transition-colors -mx-2 px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                aria-label={`Toggle ${config.english}`}
              >
                <div
                  className={cn(
                    'shrink-0 size-9 rounded-full grid place-items-center font-bold text-sm border',
                    config.bar,
                    'text-white border-transparent',
                  )}
                >
                  {config.depth}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Icon className={cn('size-4', config.text)} />
                    <span>{config.title}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {config.english}
                    </span>
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs italic">
                    {config.prompt}
                  </CardDescription>
                </div>
                <ChevronDown
                  className={cn(
                    'size-4 text-muted-foreground transition-transform shrink-0 mt-2',
                    open && 'rotate-180',
                  )}
                />
              </button>
            </CollapsibleTrigger>
            {showSuggestions ? (
              <SuggestionPopover
                level={config.id}
                textClass={config.text}
                onPick={handlePick}
              />
            ) : null}
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-2 pt-0">
            <Label
              htmlFor={`satir-${config.id}`}
              className="sr-only"
            >{`Reflection for ${config.english}`}</Label>
            <Textarea
              id={`satir-${config.id}`}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={`Reflection สำหรับชั้น ${config.depth}…`}
              rows={4}
              className="resize-y bg-background/60"
            />
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{value.length} chars</span>
              {filled ? (
                <span className={cn('font-medium', config.text)}>filled</span>
              ) : (
                <span>empty</span>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

function IcebergVisual({
  filledLevels,
}: {
  filledLevels: ReadonlySet<SatirLevel>
}) {
  return (
    <div className="sticky top-6 hidden lg:block">
      <div className="rounded-xl border bg-card p-4 space-y-3">
        <div className="text-xs font-medium text-muted-foreground">
          Satir Iceberg
        </div>
        <div className="relative h-72 flex flex-col rounded-lg overflow-hidden border bg-gradient-to-b from-sky-100 to-slate-900 dark:from-sky-950 dark:to-slate-950">
          <div className="absolute inset-x-0 top-[18%] h-px border-t border-dashed border-sky-300/60" />
          <div className="absolute inset-x-0 top-[18%] -translate-y-3 px-2 text-[10px] uppercase tracking-widest text-sky-600 dark:text-sky-400">
            waterline
          </div>
          {[...LEVELS].reverse().map((l) => {
            const filled = filledLevels.has(l.id)
            return (
              <div
                key={l.id}
                className={cn(
                  'relative flex-1 flex items-center justify-between px-3 transition-opacity',
                  filled ? 'opacity-100' : 'opacity-50',
                )}
              >
                <span
                  className={cn(
                    'text-[11px] font-medium drop-shadow-sm',
                    l.depth <= 2
                      ? 'text-slate-800 dark:text-slate-100'
                      : 'text-white',
                  )}
                >
                  {l.depth}. {l.english}
                </span>
                <div className={cn('size-2 rounded-full', l.bar)} />
              </div>
            )
          })}
        </div>
        <p className="text-[10px] leading-relaxed text-muted-foreground">
          Behavior is just the tip. Most of what drives it sits below the
          surface — feelings, beliefs, and the deepest yearning.
        </p>
      </div>
    </div>
  )
}

export function SatirConsole({ tool }: SatirConsoleProps) {
  const scenario = useSatirStore((s) => s.scenario)
  const levels = useSatirStore((s) => s.levels)
  const setScenario = useSatirStore((s) => s.setScenario)
  const setLevel = useSatirStore((s) => s.setLevel)
  const resetAll = useSatirStore((s) => s.reset)

  const filledLevels = useMemo(() => {
    const set = new Set<SatirLevel>()
    for (const l of LEVELS) {
      if (levels[l.id].trim().length > 0) set.add(l.id)
    }
    return set
  }, [levels])

  const filledCount = filledLevels.size
  const totalCount = LEVELS.length
  const scenarioFilled = scenario.trim().length > 0

  const handleReset = useCallback(() => {
    if (!scenarioFilled && filledCount === 0) return
    if (window.confirm('Clear all reflections? This cannot be undone.')) {
      resetAll()
      toast.success('Reset iceberg')
    }
  }, [scenarioFilled, filledCount, resetAll])

  const handleExport = useCallback(async () => {
    const md = buildMarkdown(scenario, levels)
    try {
      await navigator.clipboard.writeText(md)
      toast.success('Markdown copied to clipboard')
    } catch {
      toast.error('Could not access clipboard')
    }
  }, [scenario, levels])

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 px-4 pb-24 md:pb-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">{tool.name}</h1>
          <p className="text-sm text-muted-foreground">
            Guided reflection through Virginia Satir&rsquo;s Iceberg Model
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void handleExport()}
            disabled={!scenarioFilled && filledCount === 0}
          >
            <Copy className="size-4" />
            Copy as Markdown
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={!scenarioFilled && filledCount === 0}
          >
            <RotateCcw className="size-4" />
            Reset
          </Button>
        </div>
      </div>

      <Card className="border-dashed bg-gradient-to-br from-sky-50/50 to-slate-100/50 dark:from-sky-950/20 dark:to-slate-900/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Scenario</CardTitle>
          <CardDescription>
            อธิบายสถานการณ์ที่อยากสำรวจ — ใส่แค่ประเด็นหลัก แล้วค่อย dive ลงไปทีละชั้น
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="satir-scenario" className="sr-only">
            Scenario
          </Label>
          <Textarea
            id="satir-scenario"
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            placeholder={
              'เช่น: ทะเลาะกับเพื่อนร่วมงานเรื่อง deadline แล้วรู้สึกแย่มาทั้งวัน…'
            }
            rows={3}
            className="resize-y bg-background/60"
          />
          <div className="mt-2 text-[10px] text-muted-foreground">
            {scenario.length} chars · ชั้นที่กรอกแล้ว {filledCount}/
            {totalCount}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <IcebergVisual filledLevels={filledLevels} />
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>
              Depth {DEPTH_RANGE.min}–{DEPTH_RANGE.max} ·{' '}
              {filledCount} / {totalCount} filled
            </span>
            <span>top = surface · bottom = deepest</span>
          </div>
          {LEVELS.map((config) => (
            <LevelCard
              key={config.id}
              config={config}
              value={levels[config.id]}
              onChange={(value) => setLevel(config.id, value)}
            />
          ))}
        </div>
      </div>

      <p className="text-center text-[10px] text-muted-foreground">
        Reflections are saved in your browser. Use Markdown export to keep a
        copy elsewhere.
      </p>
    </div>
  )
}