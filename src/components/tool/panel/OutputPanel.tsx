import { Copy } from 'lucide-react'
import Editor from '@monaco-editor/react'
import type { ReactNode } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface OutputPanelProps {
  label: string
  labelComponent?: ReactNode
  value: string
  error?: string
  onCopy: () => void
  enableMonaco?: boolean
  defaultLanguage?: string
}

export function OutputPanel({
  label,
  labelComponent,
  value,
  error,
  onCopy,
  enableMonaco = false,
  defaultLanguage = 'plaintext',
}: OutputPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 h-10">
        {labelComponent || (
          <label className="text-sm font-medium">{label}</label>
        )}
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
      {enableMonaco ? (
        <Editor
          height="300px"
          language={defaultLanguage}
          value={error || value}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      ) : (
        <Textarea
          value={error || value}
          readOnly
          className={`flex-1 min-h-[300px] font-mono text-sm resize-none ${
            error ? 'text-destructive' : ''
          }`}
          placeholder="Output will appear here..."
        />
      )}
    </div>
  )
}
