import { run } from './$app'
import { SERVER_PORT, BASE_PATH } from './service/envValues'

run({
  port: Number(SERVER_PORT),
  basePath: BASE_PATH,
  cors: true
})
