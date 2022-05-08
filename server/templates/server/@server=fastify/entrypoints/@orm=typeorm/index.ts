import 'reflect-metadata'
import path from 'path'
import Fastify from 'fastify'
import helmet from '@fastify/helmet'
import cors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import fastifyJwt from '@fastify/jwt'
import { createConnection } from 'typeorm'
import server from '$/$server'
import ormOptions from '$/$orm'
import {
  API_JWT_SECRET,
  API_SERVER_PORT,
  API_BASE_PATH,
  API_UPLOAD_DIR,
  TYPEORM_HOST,
  TYPEORM_USERNAME,
  TYPEORM_PASSWORD,
  TYPEORM_DATABASE,
  TYPEORM_PORT
} from '$/service/envValues'

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
server(fastify, { basePath: API_BASE_PATH })

createConnection({
  type: '<%= typeormDb %>',
  host: TYPEORM_HOST,
  username: TYPEORM_USERNAME,
  password: TYPEORM_PASSWORD,
  database: TYPEORM_DATABASE,
  port: Number(TYPEORM_PORT),
  migrationsRun: true,
  synchronize: false,
  logging: false,
  ...ormOptions
}).then(() => fastify.listen(API_SERVER_PORT))
