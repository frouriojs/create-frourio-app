import path from 'path'
import Fastify from 'fastify'
import helmet from 'fastify-helmet'
import cors from 'fastify-cors'
import fastifyStatic from 'fastify-static'
import fastifyJwt from 'fastify-jwt'
import { createDBFileIfNotExists } from '$/service/tasks'
import {
  API_JWT_SECRET,
  API_SERVER_PORT,
  API_BASE_PATH,
  API_UPLOAD_DIR
} from '$/service/envValues'
import server from '$/$server'

const fastify = Fastify()

fastify.register(helmet)
fastify.register(cors)
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'static'),
  prefix: '/static'
})
if (API_UPLOAD_DIR) {
  fastify.register(fastifyStatic, {
    root: path.resolve(__dirname, API_UPLOAD_DIR),
    prefix: '/upload',
    decorateReply: false
  })
}
fastify.register(fastifyJwt, { secret: API_JWT_SECRET })
createDBFileIfNotExists(path.join(__dirname, 'database.json'))
server(fastify, { basePath: API_BASE_PATH })

fastify.listen(API_SERVER_PORT)
