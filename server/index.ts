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
  front: process.env.NODE_ENV === 'production' ? 3000 : 3001
}

if (process.env.NODE_ENV === 'production') {
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../out')
  })

  getPortPromise({ port: ports.front }).then(async (port) => {
    ports.front = port
    await server(fastify, { basePath }).listen(port)
    const subprocess = await open(`http://localhost:${port}`)
    subprocess.on('error', (e) => console.log(e))
    console.log(`open http://localhost:${port}`)
  })
} else {
  server(fastify.register(cors), { basePath }).listen(ports.front)
}
