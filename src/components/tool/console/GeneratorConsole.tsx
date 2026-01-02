import type { Tool } from '@/lib/tools/types'
import { useState } from 'react'
import { toast } from 'sonner'
import { OutputPanel } from '../panel/OutputPanel'
import { ArrowRight, RefreshCw } from 'lucide-react'
import type { GeneratorInstance } from '@/lib/tools/generator'
import { Button } from '@/components/ui/button'

export interface GeneratorConsoleProps {
  tool: Tool
  instance: GeneratorInstance
}

export function GeneratorConsole({ instance }: GeneratorConsoleProps) {
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    setIsLoading(true)
    setError('')

    try {
      const result = await instance.generate()

      setOutput(result)
    } catch {
      setError('An unexpected error occurred')
      setOutput('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    const textToCopy = error || output
    if (!textToCopy) {
      return
    }

    try {
      await navigator.clipboard.writeText(textToCopy)
      toast.success('Copied to clipboard!')
    } catch {
      toast.error('Failed to copy')
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <OutputPanel
        label={instance.getOutputLabel()}
        value={output}
        error={error}
        onCopy={handleCopy}
      />

      <div className="flex flex-wrap gap-3">
        <Button onClick={handleGenerate} className="flex-1 min-w-[150px]">
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generate...
            </>
          ) : (
            <>
              <ArrowRight className="w-4 h-4 mr-2" />
              Generate
            </>
          )}
        </Button>
      </div>

      <div className="text-center text-xs text-muted-foreground">
        All conversions are performed client-side. Your data never leaves your
        browser.
      </div>
    </div>
  )
}
