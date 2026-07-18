import { describe, expect, it } from 'vitest'
import { dockerCliToComposeTool } from './docker-cli-to-compose'

const { convert } = dockerCliToComposeTool.a
const { convert: convertBack } = dockerCliToComposeTool.b

describe('Docker CLI to Docker Compose', () => {
  describe('CLI → Compose', () => {
    it('converts basic docker run command', () => {
      const cli = 'docker run -d --name webserver nginx'
      const result = convert(cli)
      expect(result).toContain('webserver:')
      expect(result).toContain('image: nginx')
    })

    it('converts port mapping', () => {
      const cli = 'docker run -d -p 8080:80 nginx'
      const result = convert(cli)
      expect(result).toContain('ports:')
      expect(result).toContain('"8080:80"')
    })

    it('converts environment variables', () => {
      const cli = 'docker run -d -e NODE_ENV=production -e DEBUG=false nginx'
      const result = convert(cli)
      expect(result).toContain('environment:')
      expect(result).toContain('NODE_ENV: "production"')
      expect(result).toContain('DEBUG: "false"')
    })

    it('converts volume bindings', () => {
      const cli = 'docker run -d -v /data:/app/data nginx'
      const result = convert(cli)
      expect(result).toContain('volumes:')
      expect(result).toContain('/data:/app/data')
    })

    it('converts named volumes', () => {
      const cli = 'docker run -d -v pgdata:/var/lib/postgresql/data postgres'
      const result = convert(cli)
      expect(result).toContain('volumes:')
      expect(result).toContain('pgdata:')
    })

    it('converts network', () => {
      const cli = 'docker run -d --network mynet nginx'
      const result = convert(cli)
      expect(result).toContain('networks:')
      expect(result).toContain('- mynet')
      expect(result).toContain('networks:')
      expect(result).toContain('mynet:')
    })

    it('converts depends_on', () => {
      const cli = 'docker run -d --depends-on db nginx'
      const result = convert(cli)
      expect(result).toContain('depends_on:')
      expect(result).toContain('- db')
    })

    it('converts restart policy', () => {
      const cli = 'docker run -d --restart unless-stopped nginx'
      const result = convert(cli)
      expect(result).toContain('restart: unless-stopped')
    })

    it('converts privileged mode', () => {
      const cli = 'docker run -d --privileged nginx'
      const result = convert(cli)
      expect(result).toContain('privileged: true')
    })

    it('converts command', () => {
      const cli = 'docker run -d nginx nginx -t 30'
      const result = convert(cli)
      expect(result).toContain('command:')
    })

    it('converts multiple services', () => {
      const cli = `docker run -d --name webserver -p 80:80 nginx
docker run -d --name db postgres`
      const result = convert(cli)
      expect(result).toContain('webserver:')
      expect(result).toContain('db:')
      expect(result).toContain('image: nginx')
      expect(result).toContain('image: postgres')
    })
  })

  describe('Compose → CLI', () => {
    it('converts basic compose to cli', () => {
      const compose = `version: "3.8"
services:
  webserver:
    image: nginx`
      const result = convertBack(compose)
      expect(result).toContain('docker run -d')
      expect(result).toContain('--name webserver')
      expect(result).toContain('nginx')
    })

    it('converts port mapping', () => {
      const compose = `version: "3.8"
services:
  webserver:
    image: nginx
    ports:
      - "8080:80"`
      const result = convertBack(compose)
      expect(result).toContain('-p 8080:80')
    })

    it('converts environment variables (object format)', () => {
      const compose = `version: "3.8"
services:
  webserver:
    image: nginx
    environment:
      NODE_ENV: "production"`
      const result = convertBack(compose)
      expect(result).toContain('-e NODE_ENV=production')
    })

    it('converts volumes', () => {
      const compose = `version: "3.8"
services:
  webserver:
    image: nginx
    volumes:
      - /data:/app/data`
      const result = convertBack(compose)
      expect(result).toContain('-v /data:/app/data')
    })

    it('converts networks', () => {
      const compose = `version: "3.8"
services:
  webserver:
    image: nginx
    networks:
      - mynet
networks:
  mynet:
    driver: bridge`
      const result = convertBack(compose)
      expect(result).toContain('--network mynet')
    })

    it('converts depends_on', () => {
      const compose = `version: "3.8"
services:
  webserver:
    image: nginx
    depends_on:
      - db
  db:
    image: postgres`
      const result = convertBack(compose)
      expect(result).toContain('--depends-on db')
    })

    it('converts restart policy', () => {
      const compose = `version: "3.8"
services:
  webserver:
    image: nginx
    restart: unless-stopped`
      const result = convertBack(compose)
      expect(result).toContain('--restart unless-stopped')
    })

    it('converts multiple services', () => {
      const compose = `version: "3.8"
services:
  webserver:
    image: nginx
  db:
    image: postgres`
      const result = convertBack(compose)
      expect(result).toContain('webserver')
      expect(result).toContain('db')
    })
  })
})
