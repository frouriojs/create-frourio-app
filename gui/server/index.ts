import Fastify from 'fastify'
import cors from 'fastify-cors'
import { SERVER_PORT, BASE_PATH } from './service/envValues'
import server from './$server'

server(Fastify().register(cors), { basePath: BASE_PATH }).listen(SERVER_PORT)
