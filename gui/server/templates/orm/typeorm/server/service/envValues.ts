import dotenv from 'dotenv'

dotenv.config()

const USER_ID = process.env.USER_ID ?? ''
const USER_PASS = process.env.USER_PASS ?? ''
const SERVER_PORT = +(process.env.SERVER_PORT ?? '8080')
const BASE_PATH = process.env.BASE_PATH ?? ''
const API_ORIGIN = process.env.API_ORIGIN ?? ''
const TYPEORM_HOST = process.env.TYPEORM_HOST ?? ''
const TYPEORM_USERNAME = process.env.TYPEORM_USERNAME ?? ''
const TYPEORM_PASSWORD = process.env.TYPEORM_PASSWORD ?? ''
const TYPEORM_DATABASE = process.env.TYPEORM_DATABASE ?? ''
const TYPEORM_PORT = process.env.TYPEORM_PORT ?? ''

export {
  USER_ID,
  USER_PASS,
  SERVER_PORT,
  BASE_PATH,
  API_ORIGIN,
  TYPEORM_HOST,
  TYPEORM_USERNAME,
  TYPEORM_PASSWORD,
  TYPEORM_DATABASE,
  TYPEORM_PORT
}
