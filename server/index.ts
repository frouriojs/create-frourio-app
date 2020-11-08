import path from 'path'
import Fastify from 'fastify'
import cors from 'fastify-cors'
import fastifyStatic from 'fastify-static'
import open from 'open'
import { getPortPromise } from 'portfinder'
import server from './$server'
import { updateAnswers, cliMigration } from '$/service/answers'

const basePath = '/api'
export const fastify = Fastify()
export const ports = {
  client: process.env.NODE_ENV === 'production' ? 3000 : 3001
}

if (process.env.NODE_ENV === 'production') {
  getPortPromise({ port: ports.client }).then(async (port) => {
    ports.client = port

    const argIndex = process.argv.indexOf('--answers')
    if (argIndex !== -1) {
      await updateAnswers(
        cliMigration.reduce((prev, current) => {
          if (!current.when(prev)) return prev
          console.warn(current.warn)
          return current.handler(prev)
        }, JSON.parse(process.argv[argIndex + 1]))
      )
    } else {
      fastify.register(fastifyStatic, {
        root: path.join(__dirname, '../out')
      })
      await server(fastify, { basePath }).listen(port)
    }

    const subprocess = await open(`http://localhost:${port}`)
    subprocess.on('error', () => {
      console.log(`open http://localhost:${port} in the browser`)
    })
    subprocess.on('close', () => {
      console.log(`open http://localhost:${port} in the browser`)
    })
  })
} else {
  server(fastify.register(cors), { basePath }).listen(ports.client)
}
