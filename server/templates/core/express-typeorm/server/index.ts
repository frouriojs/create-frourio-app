import 'reflect-metadata'
import path from 'path'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { createConnection } from 'typeorm'
import server from './$server'
import ormOptions from './$orm'<% if (orm === 'none') { %>
import { createDBFileIfNotExists } from './service/tasks'<% } %>
import {
  SERVER_PORT,
  BASE_PATH,
  TYPEORM_HOST,
  TYPEORM_USERNAME,
  TYPEORM_PASSWORD,
  TYPEORM_DATABASE,
  TYPEORM_PORT
} from './service/envValues'

const app = express()
app.use(helmet())
app.use(cors())
<% if (orm === 'none') { %>
createDBFileIfNotExists(path.join(__dirname, 'database.json'))<% } %>
server(app, { basePath: BASE_PATH })
app.use(BASE_PATH, express.static('public'))

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
}).then(() => app.listen(SERVER_PORT))
