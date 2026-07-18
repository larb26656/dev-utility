import { createSnippetTool } from '@/lib/tools/snippet'

export const fileOpsTool = createSnippetTool({
  id: 'file-ops',
  name: 'File Operations Snippets',
  description: 'find, chmod, tar, and zip commands for file management',
  category: 'Snippet',
  items: [
    { key: 'find - by name', value: 'find . -name "config.*"', description: 'Find files named "config.*"' },
    { key: 'find - modified in 7 days', value: 'find . -mtime -7', description: 'Find files modified within 7 days' },
    { key: 'find - larger than 100MB', value: 'find . -size +100M', description: 'Find files larger than 100MB' },
    { key: 'find - exclude .git', value: 'find . -not -path "*/.git/*"', description: 'Find excluding .git directory' },
    { key: 'find - delete .tmp files', value: 'find . -name "*.tmp" -delete', description: 'Delete all .tmp files' },
    { key: 'find - exec on results', value: 'find . -name "*.log" -exec rm {} \\;', description: 'Run rm on each .log file found' },
    { key: 'chmod - 755', value: 'chmod 755 script.sh', description: 'rwxr-xr-x (owner: rwx, others: rx)' },
    { key: 'chmod - 644', value: 'chmod 644 file.txt', description: 'rw-r--r-- (owner: rw, others: r)' },
    { key: 'tar - create archive', value: 'tar -czf archive.tar.gz ./folder', description: 'Create compressed tar archive' },
    { key: 'tar - extract', value: 'tar -xzf archive.tar.gz', description: 'Extract tar.gz archive' },
    { key: 'zip - create', value: 'zip -r archive.zip ./folder', description: 'Create zip archive' },
    { key: 'unzip - extract', value: 'unzip archive.zip', description: 'Extract zip archive' },
  ],
})