import { createSnippetTool } from '@/lib/tools/snippet'

export const portTool = createSnippetTool({
  id: 'port',
  name: 'Port Management',
  description: 'Unix commands for managing ports and network connections',
  category: 'Snippet',
  items: [
    { key: 'port - find PID', value: 'lsof -i :PORT -t', description: 'Get PID of process using port' },
    { key: 'port - full info', value: 'lsof -i :PORT', description: 'Show full process info for port' },
    { key: 'port - kill', value: 'kill -9 $(lsof -t -i :PORT)', description: 'Kill process using port' },
    { key: 'port - kill gracefully', value: 'kill $(lsof -t -i :PORT)', description: 'Gracefully kill process (SIGTERM)' },
    { key: 'port - list all', value: 'lsof -i -P -n', description: 'List all open ports (no service names)' },
    { key: 'port - list listening', value: 'lsof -i -P -n | grep LISTEN', description: 'List only listening ports' },
    { key: 'port - check if open', value: 'nc -zv localhost PORT', description: 'Check if port is open' },
    { key: 'port - scan range', value: 'nc -zv localhost 3000-3010', description: 'Scan port range 3000-3010' },
    { key: 'port - process name', value: 'lsof -i :PORT | awk \'NR>1 {print $1}\'', description: 'Get process name using port' },
    { key: 'port - using fuser', value: 'fuser -k PORT/tcp', description: 'Kill process using port via fuser' },
    { key: 'port - what is using', value: 'netstat -tlnp | grep :PORT', description: 'Show what\'s using port (Linux)' },
    { key: 'port - ss (modern)', value: 'ss -tlnp | grep :PORT', description: 'Show port info using ss (modern netstat)' },
    { key: 'port - connections', value: 'netstat -an | grep :PORT', description: 'Show all connections for port' },
    { key: 'port - established', value: 'lsof -i :PORT -sTCP:ESTABLISHED', description: 'Show established connections on port' },
    { key: 'port - foreign address', value: 'lsof -i :PORT -n | awk \'NR>1 {print $9}\'', description: 'Show foreign address for port' },
  ],
})
