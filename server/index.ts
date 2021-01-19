import path from 'path'
import Fastify from 'fastify'
import FastifyNextjs from 'fastify-nextjs'
import FastifyStatic from 'fastify-static'
import open from 'open'
import { getPortPromise } from 'portfinder'
import server from './$server'
import { cliMigration, updateAnswers } from '$/service/answers'
import FastifyWebsocket from 'fastify-websocket'
import stream from 'stream'

declare module 'fastify' {
  interface FastifyInstance {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    appendLogging: (data: any) => void
  }
}

let port: number | null = null
const basePath = '/api'
;(async () => {
  const portIdx =
    Math.max(
      process.argv.lastIndexOf('--port'),
      process.argv.lastIndexOf('-p')
    ) + 1
  if (portIdx > 0 && portIdx < process.argv.length) {
    port = Number(process.argv[portIdx])
  }
  if (!port) {
    port = await getPortPromise({ port: 3000 })
  }

  const argIndex = process.argv.indexOf('--answers')
  if (argIndex !== -1) {
    await updateAnswers(
      cliMigration.reduce((prev, current) => {
        if (!current.when(prev)) return prev
        console.warn(current.warn)
        return current.handler(prev)
      }, JSON.parse(process.argv[argIndex + 1])),
      process.stdout
    )
    return
  }
  const logging = new stream.Readable({
    read() {
      // nothing
    }
  })

  const fastify = Fastify()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fastify.decorate('appendLogging', (data: any) => {
    logging.push(data)
  })
  fastify.register(FastifyStatic, {
    root: path.join(__dirname, '../out')
  })
  if (process.env.NODE_ENV === 'development') {
    await fastify
      .register(FastifyNextjs, {
        dev: true,
        conf: {
          env: {
            NEXT_PUBLIC_SERVER_PORT: port
          }
        }
      })
      .after()
    fastify.next('/')
  }
  fastify.register(FastifyWebsocket)
  fastify.get('/ws/', { websocket: true }, (connection) => {
    const handler = (chunk: unknown) => {
      connection.socket.send(chunk)
    }
    logging.on('data', handler)

    connection.socket.on('close', () => {
      logging.off('data', handler)
    })
  })

  await server(fastify, { basePath }).listen(port)
  if (process.env.NODE_ENV !== 'development') {
    if (process.env.NODE_ENV === 'test') return

    const subprocess = await open(`http://localhost:${port}`)
    subprocess.on('error', () => {
      console.log(`open http://localhost:${port} in the browser`)
    })
    subprocess.on('close', () => {
      console.log(`open http://localhost:${port} in the browser`)
    })
  }
})()
