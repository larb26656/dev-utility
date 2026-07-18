import { parse as parseYaml } from 'yaml'
import { createTwoWayTransformerTool } from '@/lib/tools/transformer'

interface DockerService {
  image: string
  container_name?: string
  ports?: Array<string>
  environment?: Record<string, string> | Array<string>
  volumes?: Array<string> | Array<{ type?: string; source?: string; target?: string; bind?: { propagation?: string } }>
  networks?: Array<string>
  depends_on?: Array<string>
  command?: string | Array<string>
  restart?: string
  privileged?: boolean
}

interface DockerCompose {
  version: string
  services: Record<string, DockerService>
  networks?: Record<string, { name?: string; driver?: string }>
  volumes?: Record<string, { name?: string }>
}

function parseEnvVar(envStr: string): { key: string; value: string } {
  const idx = envStr.indexOf('=')
  if (idx === -1) return { key: envStr, value: '' }
  return { key: envStr.slice(0, idx), value: envStr.slice(idx + 1) }
}

function parseVolume(volumeStr: string): { type: string; source: string; target: string } {
  const parts = volumeStr.split(':')
  if (parts[0].startsWith('/') || parts[0].startsWith('~') || parts[0].includes('/')) {
    return { type: 'bind', source: parts[0], target: parts[1] || '' }
  }
  return { type: 'volume', source: parts[0], target: parts[1] || '' }
}

function parseDockerRun(cli: string): DockerCompose {
  const lines = cli.trim().split('\n').map((l) => l.trim()).filter(Boolean)

  const services: Record<string, DockerService> = {}
  const networks: Record<string, { name?: string; driver?: string }> = {}
  const volumes: Record<string, { name?: string }> = {}

  for (const line of lines) {
    if (line.startsWith('#') || !line.startsWith('docker run')) continue

    const tokens = line.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || []
    const service: DockerService = { image: '' }
    const commandTokens: Array<string> = []
    let imageFound = false
    let i = 1

    while (i < tokens.length) {
      const token = tokens[i]

      switch (token) {
        case '--name':
        case '-name':
          service.container_name = tokens[++i]
          break
        case '-p':
        case '--publish': {
          const portMapping = tokens[++i]
          if (portMapping) {
            if (!service.ports) service.ports = []
            service.ports.push(portMapping)
          }
          break
        }
        case '-e':
        case '--env': {
          const envStr = tokens[++i]
          if (envStr) {
            const { key, value } = parseEnvVar(envStr)
            if (service.environment === undefined) {
              service.environment = { [key]: value }
            } else if (!Array.isArray(service.environment)) {
              service.environment[key] = value
            }
          }
          break
        }
        case '-v':
        case '--volume': {
          const volumeStr = tokens[++i]
          if (volumeStr) {
            const vol = parseVolume(volumeStr)
            if (service.volumes === undefined) {
              service.volumes = [volumeStr]
            } else if (Array.isArray(service.volumes)) {
              service.volumes.push(volumeStr)
            }
            if (vol.source && !vol.source.startsWith('/')) {
              volumes[vol.source] = { name: vol.source }
            }
          }
          break
        }
        case '--network': {
          const netName = tokens[++i]
          if (netName) {
            if (!service.networks) service.networks = []
            service.networks.push(netName)
            networks[netName] ??= { name: netName }
          }
          break
        }
        case '--link': {
          const linkTarget = tokens[++i]
          if (linkTarget) {
            if (!service.depends_on) service.depends_on = []
            service.depends_on.push(linkTarget.replace(':', ''))
          }
          break
        }
        case '--depends-on': {
          const depTarget = tokens[++i]
          if (depTarget) {
            if (!service.depends_on) service.depends_on = []
            service.depends_on.push(depTarget)
          }
          break
        }
        case '--restart': {
          service.restart = tokens[++i] || 'unless-stopped'
          break
        }
        case '--privileged':
          service.privileged = true
          break
        case '-d':
        case '--detach':
          break
        case '-it':
        case '-i':
        case '-t':
          break
        case '--rm':
          break
        case '-c':
        case '--command': {
          service.command = tokens.slice(i + 1).join(' ')
          i = tokens.length
          break
        }
        default:
          if (
            !token.startsWith('-') &&
            !service.image &&
            token !== 'docker' &&
            token !== 'run'
          ) {
            service.image = token
            imageFound = true
          } else if (imageFound && !token.startsWith('-')) {
            commandTokens.push(token)
          }
          break
      }
      i++
    }

    if (service.image) {
      if (commandTokens.length > 0) {
        service.command = commandTokens.join(' ')
      }
      const svcName = service.container_name || `service-${Object.keys(services).length + 1}`
      delete service.container_name
      services[svcName] = service
    }
  }

  const result: DockerCompose = {
    version: '3.8',
    services,
  }

  if (Object.keys(networks).length > 0) {
    result.networks = networks
  }

  if (Object.keys(volumes).length > 0) {
    result.volumes = volumes
  }

  return result
}

function formatCompose(compose: DockerCompose): string {
  const lines: Array<string> = []

  lines.push('version: "3.8"')
  lines.push('')
  lines.push('services:')

  for (const [name, service] of Object.entries(compose.services)) {
    lines.push(`  ${name}:`)

    if (service.image) {
      lines.push(`    image: ${service.image}`)
    }

    if (service.container_name) {
      lines.push(`    container_name: ${service.container_name}`)
    }

    if (service.ports && service.ports.length > 0) {
      lines.push('    ports:')
      for (const port of service.ports) {
        lines.push(`      - "${port}"`)
      }
    }

    if (service.environment) {
      lines.push('    environment:')
      if (Array.isArray(service.environment)) {
        for (const env of service.environment) {
          lines.push(`      - ${env}`)
        }
      } else {
        for (const [key, value] of Object.entries(service.environment)) {
          if (value) {
            lines.push(`      ${key}: "${value}"`)
          } else {
            lines.push(`      ${key}:`)
          }
        }
      }
    }

    if (service.volumes && service.volumes.length > 0) {
      lines.push('    volumes:')
      for (const vol of service.volumes) {
        if (typeof vol === 'string') {
          lines.push(`      - ${vol}`)
        } else if (vol.type && vol.source && vol.target) {
          lines.push(`      - type: ${vol.type}`)
          lines.push(`        source: ${vol.source}`)
          lines.push(`        target: ${vol.target}`)
        }
      }
    }

    if (service.networks && service.networks.length > 0) {
      lines.push('    networks:')
      for (const net of service.networks) {
        lines.push(`      - ${net}`)
      }
    }

    if (service.depends_on && service.depends_on.length > 0) {
      lines.push('    depends_on:')
      for (const dep of service.depends_on) {
        lines.push(`      - ${dep}`)
      }
    }

    if (service.restart) {
      lines.push(`    restart: ${service.restart}`)
    }

    if (service.privileged) {
      lines.push('    privileged: true')
    }

    if (service.command) {
      if (Array.isArray(service.command)) {
        lines.push(`    command: [${service.command.map((c) => `"${c}"`).join(', ')}]`)
      } else {
        lines.push(`    command: "${service.command}"`)
      }
    }
  }

  if (compose.networks && Object.keys(compose.networks).length > 0) {
    lines.push('')
    lines.push('networks:')
    for (const [name, net] of Object.entries(compose.networks)) {
      lines.push(`  ${name}:`)
      if (net.driver) lines.push(`    driver: ${net.driver}`)
    }
  }

  if (compose.volumes && Object.keys(compose.volumes).length > 0) {
    lines.push('')
    lines.push('volumes:')
    for (const name of Object.keys(compose.volumes)) {
      lines.push(`  ${name}:`)
    }
  }

  return lines.join('\n')
}

function formatServiceToCli(name: string, service: DockerService): string {
  const parts: Array<string> = ['docker run -d']

  if (service.container_name) {
    parts.push(`--name ${service.container_name}`)
  } else {
    parts.push(`--name ${name}`)
  }

  if (service.ports) {
    for (const port of service.ports) {
      parts.push(`-p ${port}`)
    }
  }

  if (service.environment) {
    if (Array.isArray(service.environment)) {
      for (const env of service.environment) {
        parts.push(`-e ${env}`)
      }
    } else {
      for (const [key, value] of Object.entries(service.environment)) {
        if (value) {
          parts.push(`-e ${key}=${value}`)
        } else {
          parts.push(`-e ${key}`)
        }
      }
    }
  }

  if (service.volumes) {
    for (const vol of service.volumes) {
      if (typeof vol === 'string') {
        parts.push(`-v ${vol}`)
      } else if (vol.type && vol.source && vol.target) {
        parts.push(`-v ${vol.source}:${vol.target}`)
      }
    }
  }

  if (service.networks) {
    for (const net of service.networks) {
      parts.push(`--network ${net}`)
    }
  }

  if (service.depends_on && service.depends_on.length > 0) {
    for (const dep of service.depends_on) {
      parts.push(`--depends-on ${dep}`)
    }
  }

  if (service.restart) {
    parts.push(`--restart ${service.restart}`)
  }

  if (service.privileged) {
    parts.push('--privileged')
  }

  if (service.command) {
    if (Array.isArray(service.command)) {
      parts.push(...service.command)
    } else {
      parts.push(service.command)
    }
  }

  parts.push(service.image)

  return parts.join(' \\\n  ')
}

function parseComposeToCli(composeStr: string): string {
  const parsed = parseYaml(composeStr) as DockerCompose
  const commands: Array<string> = []

  for (const [name, service] of Object.entries(parsed.services)) {
    commands.push(formatServiceToCli(name, service))
  }

  return commands.join('\n\n')
}

export const dockerCliToComposeTool = createTwoWayTransformerTool<string, string>({
  id: 'docker-cli-to-compose',
  name: 'Docker CLI ↔ Compose',
  description: 'Convert Docker CLI run commands to Docker Compose format and vice versa',
  category: 'Converter',
  a: {
    label: 'Docker CLI',
    convert: (input) => {
      const parsed = parseDockerRun(input)
      return formatCompose(parsed)
    },
  },
  b: {
    label: 'Docker Compose',
    convert: (input) => {
      return parseComposeToCli(input)
    },
  },
})
