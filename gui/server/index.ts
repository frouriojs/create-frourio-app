import path from 'path'
import Fastify from 'fastify'
import cors from 'fastify-cors'
import fastifyStatic from 'fastify-static'
import open from 'open'
import { getPortPromise } from 'portfinder'
import server from './$server'

const basePath = '/api'
export const fastify = Fastify()
export const ports = {
  server: 8080
}

if (process.env.NODE_ENV === 'production') {
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../out')
  })

  getPortPromise({ port: ports.server }).then(async port => {
    ports.server = port
    await server(fastify, { basePath }).listen(port)
    await open(`http://localhost:${port}`)
    console.log(`open http://localhost:${port}`)
  })
} else {
  server(fastify.register(cors), { basePath }).listen(ports.server)
}
