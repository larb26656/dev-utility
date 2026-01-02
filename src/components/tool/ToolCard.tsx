import { ExternalLink } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type ToolCardProps = {
  title: string
  description: string
  icon?: ReactNode
  onClick?: () => void
}

export function ToolCard({ title, description, icon, onClick }: ToolCardProps) {
  return (
    <Card
      onClick={onClick}
      className={`
        relative overflow-hidden border-border/60
        bg-card/60 backdrop-blur
        supports-[backdrop-filter]:bg-card/40
        transition-colors
        ${onClick ? 'cursor-pointer hover:bg-accent/40' : ''}
      `}
    >
      {/* subtle gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 to-transparent dark:from-white/3" />

      {/* top-right action */}
      {onClick ? (
        <Button
          size="icon"
          variant="secondary"
          className="absolute right-3 top-3 h-8 w-8 rounded-full bg-muted/50 hover:bg-muted/70"
          onClick={(e) => {
            e.stopPropagation() // ❗ไม่ให้ trigger card click ซ้ำ
            onClick()
          }}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      ) : null}

      <div className="flex gap-4 p-4">
        {/* icon */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-muted/50 ring-1 ring-border/60">
          {icon ?? <div className="h-8 w-8 rounded-md bg-foreground/10" />}
        </div>

        {/* text */}
        <div className="min-w-0 pr-10">
          <div className="truncate text-base font-semibold">{title}</div>
          <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {description}
          </div>
        </div>
      </div>
    </Card>
  )
}
