import path from 'path'
import Fastify from 'fastify'
import FastifyStatic from '@fastify/static'
import open from 'open'
import { getPortPromise } from 'portfinder'
import server from './$server'
import { updateAnswers } from 'service/answers'
import FastifyWebsocket from '@fastify/websocket'
import FastifyInject from './plugins/fastify-inject'
import stream from 'stream'
import { Command } from 'commander'
import fastifyNext from '@fastify/nextjs'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const manifest = [require][0]!('../package.json')

const dirDefault = 'my-frourio-app'

declare module 'fastify' {}

const program = new Command()

program.name(`${manifest.name}`)
program.version(`v${manifest.version}`, '-v')
program.option('-p, --port <char>', '', '3000')
program.option('--host <char>', '', 'localhost')
program.option('--answers <char>')
program.argument('[dir]', 'project directory name', dirDefault)
program.allowExcessArguments(false)

program.parse()

const options = program.opts()
const dir = program.args[0] || dirDefault

let port: number = options.port
const host: string = options.host

const basePath = '/api'
;(async () => {
  port = await getPortPromise({ port: port })

  if (options.answers !== undefined) {
    await updateAnswers(JSON.parse(options.answers), process.stdout)
    return
  }
  const logging = new stream.Readable({
    read() {
      // nothing
    }
  })
  const ready = new stream.Readable({
    read() {
      // nothing
    }
  })

  const fastify = Fastify()
  const rootDir = path.join(__dirname, '../client')

  fastify.register(FastifyStatic, { root: path.join(rootDir, 'out') })

  await fastify.register(FastifyInject, { dir, logging, ready })

  if (process.env.NODE_ENV === 'development') {
    fastify
      .register(fastifyNext, {
        dev: true,
        dir: rootDir,
        conf: {
          webpack: (config) => {
            config.resolve.symlinks = false

            return config
          }
        }
      })
      .after(() => {
        fastify.next('/')
      })
  }

  fastify.register(FastifyWebsocket)
  fastify.register(async (fastify) => {
    fastify.get('/ws/', { websocket: true }, (connection) => {
      const handler = (chunk: Buffer) => {
        connection.socket.send(chunk)
      }
      logging.on('data', handler)

      connection.socket.on('close', () => {
        logging.off('data', handler)
      })
    })

    fastify.get('/ws/ready/', { websocket: true }, (connection) => {
      const handler = (chunk: unknown) => {
        if (String(chunk) === 'ready') {
          connection.socket.send('ready')
        }
      }
      ready.on('data', handler)

      connection.socket.on('close', () => {
        ready.off('data', handler)
      })
    })
  })

  await server(fastify, { basePath }).listen({ port, host })

  if (process.env.NODE_ENV !== 'development') {
    if (process.env.NODE_ENV === 'test') return

    const subprocess = await open(`http://localhost:${port}`)
    subprocess.on('error', () => {
      console.log(`open http://localhost:${port} in the browser`)
    })
    subprocess.on('close', () => {
      console.log(`open http://localhost:${port} in the browser`)
    })
  } else {
    console.log(`open http://localhost:${port} in the browser`)
  }
})()
