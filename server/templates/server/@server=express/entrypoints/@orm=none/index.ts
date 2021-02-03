<% if (orm === 'none') { %>import path from 'path'
<% } %>import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import server from './$server'
import { createDBFileIfNotExists } from './service/tasks'
import { API_SERVER_PORT, API_BASE_PATH } from './service/envValues'

const app = express()
app.use(helmet())
app.use(cors())
createDBFileIfNotExists(path.join(__dirname, 'database.json'))
server(app, { basePath: API_BASE_PATH })
app.use(API_BASE_PATH, express.static('static'))
app.listen(API_SERVER_PORT)
