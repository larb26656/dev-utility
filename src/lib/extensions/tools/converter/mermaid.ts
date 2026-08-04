import { createFreeStyleTool } from '@/lib/tools/freestyle'
import { MermaidConsole } from '@/components/tool/console/MermaidConsole'

export const mermaidTool = createFreeStyleTool({
  id: 'mermaid',
  name: 'Mermaid Diagram',
  description:
    'Render and preview Mermaid diagrams with pan, zoom, and fullscreen',
  category: 'Converter',
  component: MermaidConsole,
})
