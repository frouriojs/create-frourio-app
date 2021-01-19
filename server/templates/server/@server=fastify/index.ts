import path from 'path'
import Fastify from 'fastify'
import helmet from 'fastify-helmet'
import cors from 'fastify-cors'
import fastifyStatic from 'fastify-static'
import fastifyJwt from 'fastify-jwt'<% if (orm === 'none') { %>
import { createDBFileIfNotExists } from './service/tasks'<% } %>
import {
  API_JWT_SECRET,
  API_SERVER_PORT,
  API_BASE_PATH,
  API_DYNAMIC_DIR
} from './service/envValues'
import server from './$server'

const fastify = Fastify()

fastify.register(helmet)
fastify.register(cors)
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'static'),
  prefix: '/static/'
})
fastify.register(fastifyStatic, {
  root: path.join(__dirname, API_DYNAMIC_DIR),
  prefix: '/dynamic/',
  decorateReply: false
})
fastify.register(fastifyJwt, { secret: API_JWT_SECRET })
<% if (orm === 'none') { %>
createDBFileIfNotExists(path.join(__dirname, 'database.json'))<% } %>
server(fastify, { basePath: API_BASE_PATH })

fastify.listen(API_SERVER_PORT)
