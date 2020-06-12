import dotenv from 'dotenv'
import { run } from './$app'

dotenv.config()

const { PORT, BASE_PATH } = process.env

run({
  port: Number(PORT),
  basePath: BASE_PATH,
  cors: true
})
