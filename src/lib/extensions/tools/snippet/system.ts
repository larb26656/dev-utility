import { createSnippetTool } from '@/lib/tools/snippet'

export const systemTool = createSnippetTool({
  id: 'system',
  name: 'System Snippets',
  description: 'ps, kill, df, du, top, and watch commands for system monitoring',
  category: 'Snippet',
  items: [
    { key: 'ps - all processes', value: 'ps aux', description: 'List all running processes' },
    { key: 'ps - grep for process', value: 'ps aux | grep "node"', description: 'Find node processes' },
    { key: 'kill - by process name', value: 'pkill -f "node"', description: 'Kill all processes matching "node"' },
    { key: 'disk usage', value: 'df -h', description: 'Show disk space usage' },
    { key: 'directory size', value: 'du -sh ./folder', description: 'Show folder size' },
    { key: 'top processes', value: 'top -o %CPU', description: 'Show top processes by CPU' },
    { key: 'watch - repeat command', value: 'watch -n 5 df -h', description: 'Run df -h every 5 seconds' },
  ],
})