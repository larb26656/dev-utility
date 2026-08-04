import { createSnippetTool } from '@/lib/tools/snippet'

export const sshTool = createSnippetTool({
  id: 'ssh',
  name: 'SSH Snippets',
  description: 'SSH key generation, key copy, tunnels, scp, and agent management',
  category: 'Snippet',
  items: [
    { key: 'ssh - generate ed25519 key', value: 'ssh-keygen -t ed25519 -C "email"', description: 'Create a modern Ed25519 keypair (recommended)' },
    { key: 'ssh - generate rsa key', value: 'ssh-keygen -t rsa -b 4096 -C "email"', description: 'Create a 4096-bit RSA keypair (legacy)' },
    { key: 'ssh - copy key to server', value: 'ssh-copy-id user@host', description: 'Install your public key for passwordless login' },
    { key: 'ssh - local port forward', value: 'ssh -L 8080:localhost:80 user@host', description: 'Tunnel local 8080 to remote port 80' },
    { key: 'ssh - remote port forward', value: 'ssh -R 80:localhost:8080 user@host', description: 'Expose local 8080 on the remote as port 80' },
    { key: 'ssh - dynamic socks proxy', value: 'ssh -D 1080 user@host', description: 'Create a SOCKS proxy on local port 1080' },
    { key: 'ssh - keep alive', value: 'ssh -o ServerAliveInterval=60 user@host', description: 'Send a keepalive packet every 60 seconds' },
    { key: 'ssh - config file', value: '~/.ssh/config', description: 'Per-host SSH config (aliases, keys, options)' },
    { key: 'scp - upload file', value: 'scp file.txt user@host:/path/', description: 'Copy a local file to a remote host' },
    { key: 'scp - download file', value: 'scp user@host:/path/file.txt .', description: 'Copy a remote file to the local machine' },
    { key: 'scp - recursive upload', value: 'scp -r folder/ user@host:/path/', description: 'Copy a whole directory to the remote' },
    { key: 'ssh - start agent', value: 'eval "$(ssh-agent -s)"', description: 'Start the SSH agent in the current shell' },
    { key: 'ssh - add key to agent', value: 'ssh-add ~/.ssh/id_ed25519', description: 'Load a private key into the agent' },
    { key: 'ssh - list agent keys', value: 'ssh-add -l', description: 'Show fingerprints of keys loaded in the agent' },
    { key: 'ssh - remove key from agent', value: 'ssh-add -d ~/.ssh/id_ed25519', description: 'Remove a key from the agent' },
  ],
})
