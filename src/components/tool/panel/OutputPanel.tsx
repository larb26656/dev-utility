import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'

interface OutputPanelProps {
  label: string
  value: string
  error?: string
  onCopy: () => void
}

export function OutputPanel({ label, value, error, onCopy }: OutputPanelProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm font-medium">{label}</label>
            <Button
              variant="outline"
              size="sm"
              onClick={onCopy}
              disabled={!value && !error}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
          <Textarea
            value={error || value}
            readOnly
            className={`flex-1 min-h-[300px] font-mono text-sm resize-none ${
              error ? 'text-destructive' : ''
            }`}
            placeholder="Output will appear here..."
          />
        </div>
      </CardContent>
    </Card>
  )
}
