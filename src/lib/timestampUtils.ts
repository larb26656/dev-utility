export type TimezoneId = 'local' | 'UTC' | string

export interface TimezoneOption {
  id: TimezoneId
  label: string
  offset: string
}

export const TIMEZONES: Array<TimezoneOption> = [
  { id: 'local', label: 'Local', offset: '' },
  { id: 'UTC', label: 'UTC', offset: '+00:00' },
  { id: 'Asia/Bangkok', label: 'Asia/Bangkok', offset: '+07:00' },
  { id: 'Asia/Singapore', label: 'Asia/Singapore', offset: '+08:00' },
  { id: 'Asia/Tokyo', label: 'Asia/Tokyo', offset: '+09:00' },
  { id: 'Asia/Shanghai', label: 'Asia/Shanghai', offset: '+08:00' },
  { id: 'Asia/Seoul', label: 'Asia/Seoul', offset: '+09:00' },
  { id: 'Asia/Jakarta', label: 'Asia/Jakarta', offset: '+07:00' },
  { id: 'Asia/Hong_Kong', label: 'Asia/Hong_Kong', offset: '+08:00' },
  { id: 'Europe/London', label: 'Europe/London', offset: '+00:00' },
  { id: 'Europe/Paris', label: 'Europe/Paris', offset: '+01:00' },
  { id: 'Europe/Berlin', label: 'Europe/Berlin', offset: '+01:00' },
  { id: 'Europe/Moscow', label: 'Europe/Moscow', offset: '+03:00' },
  { id: 'America/New_York', label: 'America/New_York', offset: '-05:00' },
  { id: 'America/Los_Angeles', label: 'America/Los_Angeles', offset: '-08:00' },
  { id: 'America/Chicago', label: 'America/Chicago', offset: '-06:00' },
  { id: 'America/Toronto', label: 'America/Toronto', offset: '-05:00' },
  { id: 'America/Vancouver', label: 'America/Vancouver', offset: '-08:00' },
  { id: 'Australia/Sydney', label: 'Australia/Sydney', offset: '+10:00' },
  { id: 'Australia/Melbourne', label: 'Australia/Melbourne', offset: '+10:00' },
  { id: 'Pacific/Auckland', label: 'Pacific/Auckland', offset: '+12:00' },
]

export function getTimezoneOffset(tzId: TimezoneId): string {
  if (tzId === 'local') return ''
  if (tzId === 'UTC') return '+00:00'

  const found = TIMEZONES.find((t) => t.id === tzId)
  if (found) return found.offset

  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tzId,
      timeZoneName: 'shortOffset',
    })
    const parts = formatter.formatToParts(new Date())
    const offsetPart = parts.find((p) => p.type === 'timeZoneName')
    if (offsetPart) {
      const offset = offsetPart.value.replace('GMT', '')
      return offset.startsWith('+') || offset.startsWith('-') ? offset : `+${offset}`
    }
  } catch {
    // ignore
  }
  return ''
}

export function getLocalTimezoneOffset(date: Date): string {
  const parts = new Intl.DateTimeFormat('en', {
    timeZoneName: 'shortOffset',
  })
    .formatToParts(date)
    .find((p) => p.type === 'timeZoneName')
  const raw = parts?.value.replace('GMT', '') ?? '+00:00'

  // Normalize: "+7" -> "+07:00", "+7:00" -> "+07:00", etc.
  const match = raw.match(/^([+-])(\d{1,2}):?(\d{2})?$/)
  if (match) {
    const sign = match[1]
    const hours = match[2].padStart(2, '0')
    const mins = match[3] ? match[3].padStart(2, '0') : '00'
    return `${sign}${hours}:${mins}`
  }

  return '+00:00'
}

export function getOffsetForDate(date: Date, tz: TimezoneId): string {
  if (tz === 'local') {
    return getLocalTimezoneOffset(date)
  }
  return getTimezoneOffset(tz)
}

export function formatDate(date: Date, tz: TimezoneId): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }

  if (tz !== 'local') {
    options.timeZone = tz
  }

  return date.toLocaleString('en-US', options)
}

export function formatTimestamp(date: Date): { ms: number; s: number } {
  return {
    ms: date.getTime(),
    s: Math.floor(date.getTime() / 1000),
  }
}

export function formatISOWithOffset(date: Date, tz: TimezoneId): string {
  const offset = getOffsetForDate(date, tz)

  const pad = (n: number, len = 2) => n.toString().padStart(len, '0')

  let year: number, month: number, day: number, hours: number, minutes: number, seconds: number

  if (tz === 'local' || tz === 'UTC') {
    year = date.getUTCFullYear()
    month = date.getUTCMonth() + 1
    day = date.getUTCDate()
    hours = date.getUTCHours()
    minutes = date.getUTCMinutes()
    seconds = date.getUTCSeconds()
  } else {
    // For named timezones, we need to format in that timezone
    const options: Intl.DateTimeFormatOptions = {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }
    const parts = new Intl.DateTimeFormat('en-CA', options).formatToParts(date)
    year = Number(parts.find((p) => p.type === 'year')?.value)
    month = Number(parts.find((p) => p.type === 'month')?.value)
    day = Number(parts.find((p) => p.type === 'day')?.value)
    const hourPart = parts.find((p) => p.type === 'hour')?.value ?? '0'
    const minPart = parts.find((p) => p.type === 'minute')?.value ?? '0'
    const secPart = parts.find((p) => p.type === 'second')?.value ?? '0'
    hours = Number(hourPart)
    minutes = Number(minPart)
    seconds = Number(secPart)
  }

  const ms = pad(date.getMilliseconds(), 3)

  const isoBase = `${year}-${pad(month)}-${pad(day)}T${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${ms}`

  if (offset === '+00:00' || offset === '+00' || offset === '+7:00') {
    return isoBase + 'Z'
  }
  return isoBase + offset
}
