import { createSnippetTool } from '@/lib/tools/snippet'

export const jqTool = createSnippetTool({
  id: 'jq',
  name: 'jq Snippets',
  description: 'jq commands for JSON processing',
  category: 'Snippet',
  items: [
    { key: 'jq - extract key', value: 'curl -s api.com | jq ".data"', description: 'Extract "data" key from JSON' },
    { key: 'jq - multiple keys', value: 'curl -s api.com | jq "{name: .name, id: .id}"', description: 'Extract multiple keys as object' },
    { key: 'jq - filter array', value: 'curl -s api.com | jq ".data[] | select(.active == true)"', description: 'Filter array items by condition' },
    { key: 'jq - map values', value: 'curl -s api.com | jq ".data | map(.name)"', description: 'Map array to just names' },
    { key: 'jq - count items', value: 'curl -s api.com | jq ".data | length"', description: 'Count items in array' },
    { key: 'jq - keys of object', value: 'curl -s api.com | jq "keys"', description: 'Get all keys of JSON object' },
  ],
})