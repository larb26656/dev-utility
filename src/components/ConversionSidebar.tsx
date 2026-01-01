import type { ConversionGroup } from '@/lib/types'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface ConversionSidebarProps {
  conversionGroups: ConversionGroup[]
  selectedConversionId?: string
  onConversionChange: (conversionId: string) => void
  isCollapsed?: boolean
}

export function ConversionSidebar({
  conversionGroups,
  selectedConversionId,
  onConversionChange,
  isCollapsed = false,
}: ConversionSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(conversionGroups.map((g) => g.category)),
  )

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  return (
    <div className="h-full">
      {conversionGroups.map((group) => {
        const isExpanded = expandedCategories.has(group.category)
        return (
          <div key={group.category} className="mb-4">
            <button
              onClick={() => toggleCategory(group.category)}
              className="w-full flex items-center justify-between text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors py-2 px-2 rounded-md hover:bg-muted/50"
            >
              <span>{!isCollapsed && group.category}</span>
              {!isCollapsed &&
                (isExpanded ? (
                  <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 ml-2 flex-shrink-0" />
                ))}
            </button>

            {isExpanded && !isCollapsed && (
              <div className="space-y-1 mt-1">
                {group.conversions.map((conversion) => {
                  const isSelected = conversion.id === selectedConversionId
                  return (
                    <button
                      key={conversion.id}
                      onClick={() => onConversionChange(conversion.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
                        isSelected
                          ? 'bg-primary text-primary-foreground font-medium'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      {conversion.name}
                    </button>
                  )
                })}
              </div>
            )}

            {isCollapsed && (
              <div className="space-y-1 mt-1">
                {group.conversions.map((conversion) => {
                  const isSelected = conversion.id === selectedConversionId
                  return (
                    <button
                      key={conversion.id}
                      onClick={() => onConversionChange(conversion.id)}
                      className={`w-full text-center px-2 py-2 rounded-md text-xs transition-all ${
                        isSelected
                          ? 'bg-primary text-primary-foreground font-medium'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                      title={conversion.name}
                    >
                      {conversion.name.charAt(0).toUpperCase()}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
