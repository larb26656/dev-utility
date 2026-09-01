import { ChevronUp, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCallback, useMemo, useState } from 'react'
import type { DragEvent } from 'react'
import type { FreeStyleTool } from '@/lib/tools/freestyle'
import type { Quadrant, TaskItem } from '@/stores/eisenhowerStore'
import { useEisenhowerStore } from '@/stores/eisenhowerStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface EisenhowerConsoleProps {
  tool: FreeStyleTool
}

interface QuadrantConfig {
  id: Quadrant
  title: string
  subtitle: string
  emoji: string
  accent: string
  ring: string
  surface: string
}

const QUADRANTS: ReadonlyArray<QuadrantConfig> = [
  {
    id: 'do',
    title: 'Do First',
    subtitle: 'Urgent & Important',
    emoji: '🔥',
    accent: 'text-red-600 dark:text-red-400',
    ring: 'ring-red-500/40 border-red-500/40',
    surface: 'bg-red-500/5',
  },
  {
    id: 'schedule',
    title: 'Schedule',
    subtitle: 'Important, Not Urgent',
    emoji: '📅',
    accent: 'text-blue-600 dark:text-blue-400',
    ring: 'ring-blue-500/40 border-blue-500/40',
    surface: 'bg-blue-500/5',
  },
  {
    id: 'delegate',
    title: 'Delegate',
    subtitle: 'Urgent, Not Important',
    emoji: '👥',
    accent: 'text-amber-600 dark:text-amber-400',
    ring: 'ring-amber-500/40 border-amber-500/40',
    surface: 'bg-amber-500/5',
  },
  {
    id: 'eliminate',
    title: 'Eliminate',
    subtitle: 'Neither',
    emoji: '🗑️',
    accent: 'text-gray-600 dark:text-gray-400',
    ring: 'ring-gray-500/40 border-gray-500/40',
    surface: 'bg-gray-500/5',
  },
]

const QUADRANT_SHORT_LABELS: Record<Quadrant, string> = {
  do: 'Q1',
  schedule: 'Q2',
  delegate: 'Q3',
  eliminate: 'Q4',
}

const DRAG_MIME = 'application/x-eisenhower-task-id'

export function parseTasks(input: string): Array<string> {
  return input
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}

function TaskCard({
  task,
  onSetQuadrant,
  onRemove,
}: {
  task: TaskItem
  onSetQuadrant: (id: string, quadrant: Quadrant | null) => void
  onRemove: (id: string) => void
}) {
  const handleDragStart = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.dataTransfer.setData(DRAG_MIME, task.id)
      e.dataTransfer.effectAllowed = 'move'
    },
    [task.id],
  )

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="group flex items-start gap-1 rounded-md border bg-background px-2 py-1.5 text-sm shadow-xs hover:border-primary/50 transition-colors cursor-grab active:cursor-grabbing"
    >
      <span className="flex-1 break-words leading-snug">{task.text}</span>
      <div className="flex shrink-0 items-center gap-0.5 opacity-60 group-hover:opacity-100">
        {QUADRANTS.map((q) => (
          <button
            key={q.id}
            type="button"
            onClick={() => onSetQuadrant(task.id, q.id)}
            title={`${q.title} — ${q.subtitle}`}
            aria-label={`Move to ${q.title}`}
            className={cn(
              'size-5 rounded text-[10px] font-bold transition-colors',
              'border bg-background hover:bg-muted',
              task.quadrant === q.id
                ? cn(q.accent, q.ring)
                : 'text-muted-foreground border-border',
            )}
          >
            {QUADRANT_SHORT_LABELS[q.id].charAt(1)}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onRemove(task.id)}
          title="Delete task"
          aria-label="Delete task"
          className="size-5 rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <Trash2 className="size-3 mx-auto" />
        </button>
      </div>
    </div>
  )
}

function DropZone({
  config,
  tasks,
  onDrop,
  onSetQuadrant,
  onRemove,
}: {
  config: QuadrantConfig
  tasks: Array<TaskItem>
  onDrop: (id: string, quadrant: Quadrant | null) => void
  onSetQuadrant: TaskCardProps['onSetQuadrant']
  onRemove: TaskCardProps['onRemove']
}) {
  const [isOver, setIsOver] = useState(false)

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    if (Array.from(e.dataTransfer.types).includes(DRAG_MIME)) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      setIsOver(true)
    }
  }, [])

  const handleDragLeave = useCallback(() => setIsOver(false), [])

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsOver(false)
      const id = e.dataTransfer.getData(DRAG_MIME)
      if (id) onDrop(id, config.id)
    },
    [config.id, onDrop],
  )

  return (
    <Card
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'transition-all',
        config.surface,
        isOver && cn('ring-2', config.ring),
      )}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span aria-hidden>{config.emoji}</span>
            <span>{config.title}</span>
          </span>
          <span
            className={cn(
              'text-xs font-normal px-2 py-0.5 rounded-full border',
              config.accent,
              config.ring,
            )}
          >
            {tasks.length}
          </span>
        </CardTitle>
        <p className="text-xs text-muted-foreground">{config.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-1.5 min-h-[80px]">
        {tasks.length === 0 ? (
          <div className="text-xs text-muted-foreground italic text-center py-4 border border-dashed rounded-md">
            Drop tasks here
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onSetQuadrant={onSetQuadrant}
              onRemove={onRemove}
            />
          ))
        )}
      </CardContent>
    </Card>
  )
}

type TaskCardProps = {
  onSetQuadrant: (id: string, quadrant: Quadrant | null) => void
  onRemove: (id: string) => void
}

export function EisenhowerConsole({ tool }: EisenhowerConsoleProps) {
  const [input, setInput] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(true)
  const tasks = useEisenhowerStore((s) => s.tasks)
  const addTasks = useEisenhowerStore((s) => s.addTasks)
  const setQuadrant = useEisenhowerStore((s) => s.setQuadrant)
  const removeTask = useEisenhowerStore((s) => s.removeTask)
  const reset = useEisenhowerStore((s) => s.reset)

  const grouped = useMemo(() => {
    const buckets: Record<Quadrant, Array<TaskItem>> = {
      do: [],
      schedule: [],
      delegate: [],
      eliminate: [],
    }
    const unassigned: Array<TaskItem> = []
    for (const task of tasks) {
      if (task.quadrant === null) {
        unassigned.push(task)
        continue
      }
      buckets[task.quadrant].push(task)
    }
    return { buckets, unassigned }
  }, [tasks])

  const handleAdd = useCallback(() => {
    const parsed = parseTasks(input)
    if (parsed.length === 0) {
      toast.error('Please enter at least one task')
      return
    }
    addTasks(parsed)
    setInput('')
    toast.success(`Added ${parsed.length} task${parsed.length === 1 ? '' : 's'}`)
  }, [input, addTasks])

  const handleReset = useCallback(() => {
    if (tasks.length === 0) return
    if (window.confirm('Clear all tasks? This cannot be undone.')) {
      reset()
      toast.success('Reset matrix')
    }
  }, [tasks.length, reset])

  const handleUnassignedDrop = useCallback(
    (id: string) => {
      setQuadrant(id, null)
    },
    [setQuadrant],
  )

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 px-4 pb-24 md:pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{tool.name}</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={tasks.length === 0}
        >
          <RotateCcw className="size-4 mr-1" />
          Reset all
        </Button>
      </div>

      {isAddOpen ? (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="text-base font-medium">Add Tasks</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Enter one task per line. Tasks are separated by newlines.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsAddOpen(false)}
                aria-label="Collapse add tasks"
                title="Hide add tasks"
              >
                <ChevronUp className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="eisenhower-input" className="sr-only">
                Tasks
              </Label>
              <Textarea
                id="eisenhower-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={'Write report\nReply to emails\nClean inbox'}
                rows={4}
                className="font-mono text-sm resize-y"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleAdd} disabled={!input.trim()}>
                <Plus className="size-4" />
                Add tasks
              </Button>
              <Button variant="ghost" onClick={() => setInput('')} disabled={!input}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex">
          <Button
            variant="outline"
            onClick={() => setIsAddOpen(true)}
            aria-label="Show add tasks"
          >
            <Plus className="size-4" />
            Add tasks
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {QUADRANTS.map((q) => (
          <DropZone
            key={q.id}
            config={q}
            tasks={grouped.buckets[q.id]}
            onDrop={setQuadrant}
            onSetQuadrant={setQuadrant}
            onRemove={removeTask}
          />
        ))}
      </div>

      <DropZoneUnassigned
        tasks={grouped.unassigned}
        onSetQuadrant={setQuadrant}
        onRemove={removeTask}
        onDrop={handleUnassignedDrop}
      />

      <div className="text-center text-[10px] md:text-xs text-muted-foreground leading-tight px-2">
        Drag tasks between quadrants or click the Q1–Q4 buttons to categorize.
        State is saved in your browser.
      </div>
    </div>
  )
}

function DropZoneUnassigned({
  tasks,
  onSetQuadrant,
  onRemove,
  onDrop,
}: {
  tasks: Array<TaskItem>
  onSetQuadrant: TaskCardProps['onSetQuadrant']
  onRemove: TaskCardProps['onRemove']
  onDrop: (id: string) => void
}) {
  const [isOver, setIsOver] = useState(false)

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    if (Array.from(e.dataTransfer.types).includes(DRAG_MIME)) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      setIsOver(true)
    }
  }, [])

  const handleDragLeave = useCallback(() => setIsOver(false), [])

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsOver(false)
      const id = e.dataTransfer.getData(DRAG_MIME)
      if (id) onDrop(id)
    },
    [onDrop],
  )

  return (
    <Card
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'transition-all',
        isOver && 'ring-2 ring-primary/40 border-primary/40',
      )}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center justify-between">
          <span>Unassigned</span>
          <span className="text-xs font-normal px-2 py-0.5 rounded-full border text-muted-foreground">
            {tasks.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5 min-h-[60px]">
        {tasks.length === 0 ? (
          <div className="text-xs text-muted-foreground italic text-center py-3 border border-dashed rounded-md">
            Drag here to move a task back to unassigned
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onSetQuadrant={onSetQuadrant}
              onRemove={onRemove}
            />
          ))
        )}
      </CardContent>
    </Card>
  )
}
