import { createSnippetTool } from '@/lib/tools/snippet'

export const textProcessTool = createSnippetTool({
  id: 'text-process',
  name: 'Text Processing Snippets',
  description: 'grep, awk, sed, and xargs commands for text manipulation',
  category: 'Snippet',
  items: [
    { key: 'grep - "error" in file', value: 'grep "error" app.log', description: 'Find lines containing "error"' },
    { key: 'grep - case insensitive', value: 'grep -i "error" app.log', description: 'Find "error" ignoring case' },
    { key: 'grep - with line numbers', value: 'grep -n "error" app.log', description: 'Find + show line numbers' },
    { key: 'grep - recursive in all .log', value: 'grep -r "failed" /var/log/*.log', description: 'Search recursively in all .log files' },
    { key: 'grep - invert (NOT)', value: 'grep -v "success" app.log', description: 'Find lines NOT containing "success"' },
    { key: 'grep - lines starting with WARN', value: 'grep "^WARN" app.log', description: 'Find lines that start with "WARN"' },
    { key: 'grep - multiple patterns (OR)', value: 'grep -E "error|warning|failed" app.log', description: 'Find lines with error OR warning OR failed' },
    { key: 'awk - print columns 1 & 3', value: "awk '{print $1, $3}' data.txt", description: 'Print column 1 and 3 separated by space' },
    { key: 'awk - print last column', value: "awk '{print $NF}' data.txt", description: 'Print the last column' },
    { key: 'awk - filter column > value', value: "awk '$1 > 100 {print $0}' data.txt", description: 'Print lines where column 1 > 100' },
    { key: 'awk - sum column', value: "awk '{sum+=$2} END {print sum}' data.txt", description: 'Sum all values in column 2' },
    { key: 'awk - count lines', value: "awk 'END {print NR}' data.txt", description: 'Print total number of lines' },
    { key: 'awk - replace delimiter', value: "awk -F: '{print $1\",\"$2}' data.txt", description: 'Replace : with , between column 1 & 2' },
    { key: 'sed - find & replace all', value: "sed 's/foo/bar/g' file.txt", description: 'Replace all "foo" with "bar"' },
    { key: 'sed - delete lines with pattern', value: "sed '/pattern/d' file.txt", description: 'Delete lines containing "pattern"' },
    { key: 'sed - insert line after', value: "sed -i '3a\\New line' file.txt", description: 'Insert "New line" after line 3' },
    { key: 'xargs - with placeholder', value: 'find . -name "*.txt" | xargs -I{} rm {}', description: 'Remove each .txt file found' },
    { key: 'xargs - one arg at a time', value: 'echo "a b c" | xargs -n1 echo', description: 'Process one argument per line' },
  ],
})