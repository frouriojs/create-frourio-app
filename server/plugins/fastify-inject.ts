import type { FastifyInstance, FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'
import stream from 'stream'

declare module 'fastify' {
  interface FastifyInstance {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    appendLogging: (data: any) => void
    clientReady: () => void
  }
  interface FastifyRequest {
    dir: string
  }
}

export interface FastifyInjectOptions {
  dir: string
  logging: stream.Readable
  ready: stream.Readable
}

const fastifyInject: FastifyPluginCallback<FastifyInjectOptions> = fp(
  (
    fastify: FastifyInstance,
    options: FastifyInjectOptions,
    next: () => void
  ) => {
    fastify.decorateRequest('dir', { getter: () => options.dir })
    fastify.decorate('appendLogging', (data: any) => {
      options.logging.push(data)
    })
    fastify.decorate('clientReady', () => {
      options.ready.push('ready')
    })
    next()
  },
  {
    fastify: '>=3',
    name: 'fastify-winston-logger'
  }
)

export default fastifyInject
