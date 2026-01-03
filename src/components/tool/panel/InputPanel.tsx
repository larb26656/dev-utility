import Editor from '@monaco-editor/react'
import type { ReactNode } from 'react'
import { Textarea } from '@/components/ui/textarea'

interface InputPanelProps {
  label: string
  labelComponent?: ReactNode
  value: string
  onChange: (value: string) => void
  placeholder: string
  characterCount?: number
  enableMonaco?: boolean
  defaultLanguage?: string
}

export function InputPanel({
  label,
  labelComponent,
  value,
  onChange,
  placeholder,
  characterCount,
  enableMonaco = false,
  defaultLanguage = 'plaintext',
}: InputPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4  h-10">
        {labelComponent || (
          <label className="text-sm font-medium">{label}</label>
        )}
        {characterCount !== undefined && (
          <span className="text-xs text-muted-foreground">
            {characterCount} chars
          </span>
        )}
      </div>
      {enableMonaco ? (
        <Editor
          height="300px"
          language={defaultLanguage}
          value={value}
          onChange={(val) => onChange(val || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 min-h-[300px] font-mono text-sm resize-none"
        />
      )}
    </div>
  )
}
