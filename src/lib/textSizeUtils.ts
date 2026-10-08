export interface TextSizeStats {
  bytes: number
  kilobytes: number
  characters: number
  charactersNoSpaces: number
  words: number
  lines: number
}

export function getUtf8Bytes(text: string): number {
  return new TextEncoder().encode(text).length
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function computeTextStats(text: string): TextSizeStats {
  const bytes = getUtf8Bytes(text)
  const trimmed = text.trim()
  return {
    bytes,
    kilobytes: bytes / 1024,
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    words: trimmed ? trimmed.split(/\s+/).length : 0,
    lines: text === '' ? 0 : text.split('\n').length,
  }
}
