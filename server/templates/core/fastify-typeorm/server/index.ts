import 'reflect-metadata'
import path from 'path'
import Fastify from 'fastify'
import helmet from 'fastify-helmet'
import cors from 'fastify-cors'
import fastifyStatic from 'fastify-static'
import fastifyJwt from 'fastify-jwt'
import { createConnection } from 'typeorm'
import server from './$server'
import ormOptions from './$orm'<% if (orm === 'none') { %>
import { createDBFileIfNotExists } from './service/tasks'<% } %>
import {
  JWT_SECRET,
  SERVER_PORT,
  BASE_PATH,
  TYPEORM_HOST,
  TYPEORM_USERNAME,
  TYPEORM_PASSWORD,
  TYPEORM_DATABASE,
  TYPEORM_PORT
} from './service/envValues'

const fastify = Fastify()

fastify.register(helmet)
fastify.register(cors)
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: BASE_PATH
})
fastify.register(fastifyJwt, { secret: JWT_SECRET })
<% if (orm === 'none') { %>
createDBFileIfNotExists(path.join(__dirname, 'database.json'))<% } %>
server(fastify, { basePath: BASE_PATH })

createConnection({
  type: '<%= typeormDB %>',
  host: TYPEORM_HOST,
  username: TYPEORM_USERNAME,
  password: TYPEORM_PASSWORD,
  database: TYPEORM_DATABASE,
  port: Number(TYPEORM_PORT),
  migrationsRun: true,
  synchronize: false,
  logging: false,
  ...ormOptions
}).then(() => fastify.listen(SERVER_PORT))
