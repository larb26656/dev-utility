import type { TransformerInstance } from '@/lib/tools/transformer'
import type { Tool } from '@/lib/tools/types'
import { useState } from 'react'
import { toast } from 'sonner'
import { InputPanel } from '../panel/InputPanel'
import { OutputPanel } from '../panel/OutputPanel'
import { ArrowRight, RefreshCw, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface TransformerConsoleProps {
  tool: Tool
  instance: TransformerInstance
}

export function TransformerConsole({ instance }: TransformerConsoleProps) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleConvert = async () => {
    if (!input) {
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await instance.convert(input)

      setOutput(result)
    } catch {
      setError('An unexpected error occurred')
      setOutput('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwap = () => {
    if (!instance) {
      return
    }

    if (!instance.canSwap) {
      return
    }

    instance.swap()
    setInput(output)
    setOutput(input)
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
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
      <div className="grid md:grid-cols-2 gap-6">
        <InputPanel
          label={instance.getInputLabel()}
          value={input}
          onChange={setInput}
          placeholder={`Enter ${instance.getInputLabel()} ...`}
          characterCount={input.length}
        />
        <OutputPanel
          label={instance.getOutputLabel()}
          value={output}
          error={error}
          onCopy={handleCopy}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={handleConvert} className="flex-1 min-w-[150px]">
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Converting...
            </>
          ) : (
            <>
              <ArrowRight className="w-4 h-4 mr-2" />
              Convert
            </>
          )}
        </Button>

        {instance.canSwap && (
          <Button
            onClick={handleSwap}
            variant="outline"
            disabled={!output || !!error}
            className="flex-1 min-w-[150px]"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Swap Direction
          </Button>
        )}

        <Button
          onClick={handleClear}
          variant="outline"
          disabled={!input && !output}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>

      <div className="text-center text-xs text-muted-foreground">
        All conversions are performed client-side. Your data never leaves your
        browser.
      </div>
    </div>
  )
}
