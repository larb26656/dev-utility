import { createSnippetTool } from '@/lib/tools/snippet'

export const curlTool = createSnippetTool({
  id: 'curl',
  name: 'cURL Snippets',
  description: 'Common curl commands for HTTP requests',
  category: 'Snippet',
  items: [
    { key: 'curl - GET request', value: 'curl https://api.example.com/users', description: 'Simple GET request' },
    { key: 'curl - POST JSON', value: "curl -X POST -H 'Content-Type: application/json' -d '{\"name\":\"test\"}' https://api.example.com", description: 'POST JSON data' },
    { key: 'curl - with auth token', value: 'curl -H "Authorization: Bearer $TOKEN" https://api.example.com', description: 'GET with Bearer token' },
    { key: 'curl - show headers only', value: 'curl -I https://example.com', description: 'Show response headers only' },
    { key: 'curl - follow redirects', value: 'curl -L https://example.com', description: 'Follow HTTP redirects' },
  ],
})