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
// @ts-expect-error
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('500 Internal Server Error')
})
app.listen(SERVER_PORT)
