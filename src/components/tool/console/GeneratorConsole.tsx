import { useState } from 'react'
import { toast } from 'sonner'
import { ArrowRight, RefreshCw } from 'lucide-react'
import { OutputPanel } from '../panel/OutputPanel'
import type { Tool } from '@/lib/tools/types'
import type { GeneratorInstance } from '@/lib/tools/generator'
import { Button } from '@/components/ui/button'
import { FloatingActionBar } from '@/components/ui/floating-action-bar'
import { getErrorMessage } from '@/utils'

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
    } catch (e) {
      const errMsg = getErrorMessage(e)
      setError(errMsg)
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
    <div className="w-full max-w-5xl mx-auto space-y-4 md:space-y-6 px-4 pb-24 md:pb-6">
      <OutputPanel
        label={instance.getOutputLabel()}
        value={output}
        error={error}
        onCopy={handleCopy}
      />

      <div className="text-center text-[10px] md:text-xs text-muted-foreground leading-tight px-2">
        All conversions are performed client-side. Your data never leaves your
        browser.
      </div>

      <FloatingActionBar>
        <Button
          onClick={handleGenerate}
          className="flex-1 min-w-[120px] md:min-w-[150px] h-10 md:h-auto"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">Generate...</span>
              <span className="sm:hidden">Gen...</span>
            </>
          ) : (
            <>
              <ArrowRight className="w-4 h-4" />
              Generate
            </>
          )}
        </Button>
      </FloatingActionBar>
    </div>
  )
}
