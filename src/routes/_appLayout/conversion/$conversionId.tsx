import { InputPanel } from '@/components/InputPanel'
import { OutputPanel } from '@/components/OutputPanel'
import { Button } from '@/components/ui/button'
import { registry } from '@/lib'
import { createRuntimeConversion } from '@/lib/runtime-conversion'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, RefreshCw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/_appLayout/conversion/$conversionId')({
  component: RouteComponent,
  loader: ({ params }) => {
    const data = registry.get(params.conversionId)

    if (!data) {
      throw new Error('Conversion not found')
    }

    const conversion = createRuntimeConversion(data)

    return { conversion, data, crumb: data.name }
  },
})

function RouteComponent() {
  const { conversion } = Route.useLoaderData()

  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleConvert = async () => {
    if (!conversion || !input) {
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await conversion.convert(input)

      setOutput(result)
    } catch {
      setError('An unexpected error occurred')
      setOutput('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwap = () => {
    if (!conversion) {
      return
    }

    if (!conversion.canSwap) {
      return
    }

    conversion.swap()
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
          label={conversion.getInputLabel()}
          value={input}
          onChange={setInput}
          placeholder={`Enter ${conversion.getInputLabel()} ...`}
          characterCount={input.length}
        />
        <OutputPanel
          label={conversion.getOutputLabel()}
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

        {conversion.canSwap && (
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
