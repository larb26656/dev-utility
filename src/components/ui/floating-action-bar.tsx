import type { ReactNode } from 'react'

interface FloatingActionBarProps {
  children: ReactNode
  className?: string
}

export function FloatingActionBar({
  children,
  className = '',
}: FloatingActionBarProps) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 md:relative bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t md:border-0 p-3 md:p-0 z-50 ${className}`}
    >
      <div className="max-w-5xl mx-auto flex flex-wrap gap-2 md:gap-3">
        {children}
      </div>
    </div>
  )
}
