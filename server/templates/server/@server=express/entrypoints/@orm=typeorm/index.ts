import 'reflect-metadata'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { createConnection } from 'typeorm'
import server from '$/$server'
import ormOptions from '$/$orm'
import {
  API_SERVER_PORT,
  API_BASE_PATH,
  API_UPLOAD_DIR,
  TYPEORM_HOST,
  TYPEORM_USERNAME,
  TYPEORM_PASSWORD,
  TYPEORM_DATABASE,
  TYPEORM_PORT
} from '$/service/envValues'

const app = express()
app.use(helmet())
app.use(cors())
server(app, { basePath: API_BASE_PATH })
app.use('/static', express.static('static'))
if (API_UPLOAD_DIR) app.use('/upload', express.static(API_UPLOAD_DIR))

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
}).then(() => app.listen(API_SERVER_PORT))
