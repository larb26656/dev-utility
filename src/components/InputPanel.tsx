import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

interface InputPanelProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  characterCount?: number;
}

export function InputPanel({ value, onChange, placeholder, characterCount }: InputPanelProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm font-medium">Input</label>
            {characterCount !== undefined && (
              <span className="text-xs text-muted-foreground">{characterCount} chars</span>
            )}
          </div>
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 min-h-[300px] font-mono text-sm resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
}
