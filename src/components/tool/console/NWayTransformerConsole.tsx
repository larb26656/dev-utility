import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ArrowRight, RefreshCw, Trash2 } from 'lucide-react'
import { InputPanel } from '../panel/InputPanel'
import { OutputPanel } from '../panel/OutputPanel'
import type { Tool } from '@/lib/tools/types'
import type { NWayTransformerInstance } from '@/lib/tools/transformer'
import { Button } from '@/components/ui/button'
import { FloatingActionBar } from '@/components/ui/floating-action-bar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getErrorMessage } from '@/utils'

export interface NWayTransformerConsoleProps {
  tool: Tool
  instance: NWayTransformerInstance
  defaultInputFormat?: string
  defaultOutputFormat?: string
}

export function NWayTransformerConsole({
  instance,
  defaultInputFormat,
  defaultOutputFormat,
}: NWayTransformerConsoleProps) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [inputFormat, setInputFormat] = useState(defaultInputFormat ?? '')
  const [outputFormat, setOutputFormat] = useState(defaultOutputFormat ?? '')

  const formats = instance.getFormats()
  const availableOutputFormats = formats.filter((f) => f !== inputFormat)

  const isCanConvert = inputFormat && outputFormat && input

  const handleConvert = async () => {
    if (!input) {
      return
    }

    setIsLoading(true)
    setError('')

    try {
      if (!isCanConvert) {
        return
      }

      const result = await instance.convert(input)

      setOutput(result)
    } catch (e) {
      console.error(e)
      const errMsg = getErrorMessage(e)
      setError(errMsg)
      setOutput('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwap = () => {
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

  useEffect(() => {
    instance.setInputFormat(inputFormat)
  }, [inputFormat, instance])

  useEffect(() => {
    instance.setOutputFormat(outputFormat)
  }, [outputFormat, instance])

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('inputFormat', inputFormat)
    url.searchParams.set('outputFormat', outputFormat)
    window.history.replaceState({}, '', url.toString())
  }, [inputFormat, outputFormat])

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 md:space-y-6 px-4 pb-24 md:pb-6">
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <InputPanel
          label={inputFormat || 'Input'}
          labelComponent={
            <div className="flex items-center gap-2 w-full">
              <Select value={inputFormat} onValueChange={setInputFormat}>
                <SelectTrigger className="w-full md:w-[180px] h-8">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {formats.map((format) => (
                    <SelectItem key={format} value={format}>
                      {format}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          }
          value={input}
          onChange={setInput}
          placeholder={`Enter ${inputFormat || 'input'} ...`}
          characterCount={input.length}
          enableMonaco={true}
        />
        <OutputPanel
          label={outputFormat || 'Output'}
          labelComponent={
            <div className="flex items-center gap-2 w-full">
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger className="w-full md:w-[180px] h-8">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {availableOutputFormats.map((format) => (
                    <SelectItem key={format} value={format}>
                      {format}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          }
          value={output}
          error={error}
          onCopy={handleCopy}
          enableMonaco={true}
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
