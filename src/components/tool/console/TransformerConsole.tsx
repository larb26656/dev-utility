import { useState } from 'react'
import { toast } from 'sonner'
import { ArrowRight, RefreshCw, Trash2 } from 'lucide-react'
import { InputPanel } from '../panel/InputPanel'
import { OutputPanel } from '../panel/OutputPanel'
import type { Tool } from '@/lib/tools/types'
import type { TransformerInstance } from '@/lib/tools/transformer'
import { Button } from '@/components/ui/button'
import { FloatingActionBar } from '@/components/ui/floating-action-bar'
import { getErrorMessage } from '@/utils'

export interface TransformerConsoleProps {
  tool: Tool
  instance: TransformerInstance
}

export function TransformerConsole({ instance }: TransformerConsoleProps) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const isCanConvert = !!input

  const handleConvert = async () => {
    if (!isCanConvert) {
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await instance.convert(input)

      setOutput(result)
    } catch (e) {
      const errMsg = getErrorMessage(e)
      setError(errMsg)
      setOutput('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwap = () => {
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
    <div className="w-full max-w-5xl mx-auto space-y-4 md:space-y-6 px-4 pb-24 md:pb-6">
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
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

      <div className="text-center text-[10px] md:text-xs text-muted-foreground leading-tight px-2">
        All conversions are performed client-side. Your data never leaves your
        browser.
      </div>

      <FloatingActionBar>
        <Button
          onClick={handleConvert}
          className="flex-1 min-w-[100px] md:min-w-[150px] h-10 md:h-auto"
          disabled={!isCanConvert}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">Converting...</span>
              <span className="sm:hidden">Converting...</span>
            </>
          ) : (
            <>
              <ArrowRight className="w-4 h-4" />
              Convert
            </>
          )}
        </Button>

        {instance.canSwap && (
          <Button
            onClick={handleSwap}
            variant="outline"
            disabled={!output || !!error}
            className="flex-1 min-w-[80px] md:min-w-[150px] h-10 md:h-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Swap Direction</span>
            <span className="sm:hidden">Swap</span>
          </Button>
        )}

        <Button
          onClick={handleClear}
          variant="outline"
          disabled={!input && !output}
          className="min-w-[60px] md:min-w-auto h-10 md:h-auto"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Clear</span>
        </Button>
      </FloatingActionBar>
    </div>
  )
}
