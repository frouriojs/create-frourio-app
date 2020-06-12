import dotenv from 'dotenv'
import { run } from './$app'

dotenv.config()

const {
  PORT,
  BASE_PATH,
  TYPEORM_HOST,
  TYPEORM_USERNAME,
  TYPEORM_PASSWORD,
  TYPEORM_DATABASE,
  TYPEORM_PORT
} = process.env

run({
  port: Number(PORT),
  basePath: BASE_PATH,
  cors: true,
  typeorm: {
    type: 'mysql',
    host: TYPEORM_HOST,
    username: TYPEORM_USERNAME,
    password: TYPEORM_PASSWORD,
    database: TYPEORM_DATABASE,
    port: Number(TYPEORM_PORT),
    migrationsRun: true,
    synchronize: false,
    logging: false
  }
})
