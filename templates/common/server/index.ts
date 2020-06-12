import dotenv from 'dotenv'
import { run } from './$app'

dotenv.config()

const { SERVER_PORT, BASE_PATH } = process.env

run({
  port: Number(SERVER_PORT),
  basePath: BASE_PATH,
  cors: true
})
