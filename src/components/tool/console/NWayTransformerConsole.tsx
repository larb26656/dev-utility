import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ArrowRight, RefreshCw, Trash2 } from 'lucide-react'
import { InputPanel } from '../panel/InputPanel'
import { OutputPanel } from '../panel/OutputPanel'
import type { Tool } from '@/lib/tools/types'
import type { NWayTransformerInstance } from '@/lib/tools/transformer'
import { Button } from '@/components/ui/button'
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
  tool,
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
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <InputPanel
          label={inputFormat || 'Input'}
          labelComponent={
            <div className="flex items-center gap-2">
              <Select value={inputFormat} onValueChange={setInputFormat}>
                <SelectTrigger className="w-[180px] h-8">
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
            <div className="flex items-center gap-2">
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger className="w-[180px] h-8">
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
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleConvert}
          className="flex-1 min-w-[150px]"
          disabled={!isCanConvert}
        >
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

        <Button
          onClick={handleSwap}
          variant="outline"
          disabled={!output || !!error}
          className="flex-1 min-w-[150px]"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Swap Direction
        </Button>

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
