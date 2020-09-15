import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import server from './$server'
import { SERVER_PORT, BASE_PATH } from './service/envValues'

const app = express()
app.use(helmet())
app.use(cors())

server(app, { basePath: BASE_PATH })
app.use(BASE_PATH, express.static('public'))
app.listen(SERVER_PORT)
