'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { ConversionSidebar } from '@/components/ConversionSidebar';
import { ArrowRight, RefreshCw, Trash2, Menu, X } from 'lucide-react';
import { registry } from '@/lib';
import { toast } from 'sonner';

export default function Home() {
  const [selectedConversionId, setSelectedConversionId] = useState<string>();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const conversionGroups = registry.getGroups();

  const handleConvert = async () => {
    if (!selectedConversionId || !input) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const conversion = registry.get(selectedConversionId);
      if (!conversion) {
        setError('Conversion not found');
        return;
      }

      const result = await conversion.convert(input);

      if (result.success) {
        setOutput(String(result.data));
      } else {
        setError(result.error);
        setOutput('');
      }
    } catch {
      setError('An unexpected error occurred');
      setOutput('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwap = () => {
    const conversion = registry.get(selectedConversionId || '');
    if (conversion?.bidirectional && conversion.reverseConversionId) {
      setInput(output);
      setSelectedConversionId(conversion.reverseConversionId);
      setOutput('');
      setError('');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const handleCopy = async () => {
    const textToCopy = error || output;
    if (!textToCopy) {
      return;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const selectedConversion = selectedConversionId ? registry.get(selectedConversionId) : undefined;

  const placeholder = selectedConversion
    ? `Enter ${selectedConversion.inputFormat}...`
    : 'Select a conversion type and enter your input...';

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <div className="flex flex-col h-screen">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-4 md:px-6">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">Dev Convert Tool</h1>
                <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                  Fast, client-side conversion tools for developers
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-background border-r transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="h-full flex flex-col p-4">
              <ConversionSidebar
                conversionGroups={conversionGroups}
                selectedConversionId={selectedConversionId}
                onConversionChange={(id) => {
                  setSelectedConversionId(id);
                  setIsMobileMenuOpen(false);
                }}
              />
            </div>
          </aside>

          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <InputPanel
                  value={input}
                  onChange={setInput}
                  placeholder={placeholder}
                  characterCount={input.length}
                />
                <OutputPanel value={output} error={error} onCopy={handleCopy} />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleConvert}
                  disabled={!selectedConversionId || !input || isLoading}
                  className="flex-1 min-w-[150px]"
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

                {selectedConversion?.bidirectional && (
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

                <Button onClick={handleClear} variant="outline" disabled={!input && !output}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>

              <div className="text-center text-xs text-muted-foreground">
                All conversions are performed client-side. Your data never leaves your browser.
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
