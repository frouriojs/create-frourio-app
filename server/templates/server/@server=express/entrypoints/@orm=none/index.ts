<% if (orm === 'none') { %>import path from 'path'
<% } %>import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import server from '$/$server'
import { createDBFileIfNotExists } from '$/service/tasks'
import {
  API_SERVER_PORT,
  API_BASE_PATH,
  API_UPLOAD_DIR
} from '$/service/envValues'

const app = express()
app.use(helmet())
app.use(cors())
createDBFileIfNotExists(path.join(__dirname, 'database.json'))
server(app, { basePath: API_BASE_PATH })
app.use('/static', express.static('static'))
if (API_UPLOAD_DIR) app.use('/upload', express.static(API_UPLOAD_DIR))
app.listen(API_SERVER_PORT)
