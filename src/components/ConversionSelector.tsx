import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ConversionGroup } from '@/lib/types'

interface ConversionSelectorProps {
  conversionGroups: ConversionGroup[]
  selectedConversionId?: string
  onConversionChange: (conversionId: string) => void
}

export function ConversionSelector({
  conversionGroups,
  selectedConversionId,
  onConversionChange,
}: ConversionSelectorProps) {
  const selectedConversion = conversionGroups
    .flatMap((g) => g.conversions)
    .find((c) => c.id === selectedConversionId)

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">
          Conversion Type
        </label>
        <Select value={selectedConversionId} onValueChange={onConversionChange}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a conversion..." />
          </SelectTrigger>
          <SelectContent>
            {conversionGroups.map((group) => (
              <div key={group.category}>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                  {group.category}
                </div>
                {group.conversions.map((conversion) => (
                  <SelectItem key={conversion.id} value={conversion.id}>
                    {conversion.name}
                  </SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedConversion && (
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">
            {selectedConversion.name}
          </p>
        </div>
      )}
    </div>
  )
}
