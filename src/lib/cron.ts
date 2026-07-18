import { CronExpressionParser } from 'cron-parser'
import cronstrue from 'cronstrue'

export interface CronParts {
  minute: string
  hour: string
  dayOfMonth: string
  month: string
  dayOfWeek: string
}

export function buildCronExpression(part: CronParts): string {
  return `${part.minute} ${part.hour} ${part.dayOfMonth} ${part.month} ${part.dayOfWeek}`
}

export function parseCronExpression(expression: string): CronParts | null {
  const parts = expression.trim().split(/\s+/)
  if (parts.length !== 5) return null

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts

  if (!minute || !hour || !dayOfMonth || !month || !dayOfWeek) {
    return null
  }

  return { minute, hour, dayOfMonth, month, dayOfWeek }
}

export function validateCronExpression(expression: string): boolean {
  try {
    CronExpressionParser.parse(expression)
    return true
  } catch {
    return false
  }
}

export function getCronDescription(expression: string): string {
  try {
    return cronstrue.toString(expression)
  } catch {
    return 'Invalid expression'
  }
}

export function getNextRuns(expression: string, count: number = 5): Array<string> {
  try {
    const interval = CronExpressionParser.parse(expression)
    const runs: Array<string> = []
    for (let i = 0; i < count; i++) {
      const next = interval.next()
      runs.push(next.toDate().toISOString())
    }
    return runs
  } catch {
    return []
  }
}

export function getNextRunDate(expression: string): Date | null {
  try {
    const interval = CronExpressionParser.parse(expression)
    return interval.next().toDate()
  } catch {
    return null
  }
}

export function isValidCronParts(part: Partial<CronParts>): part is CronParts {
  return !!(
    part.minute &&
    part.hour &&
    part.dayOfMonth &&
    part.month &&
    part.dayOfWeek
  )
}
