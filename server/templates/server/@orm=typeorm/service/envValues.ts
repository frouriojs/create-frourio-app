import dotenv from 'dotenv'

dotenv.config()

const API_JWT_SECRET = process.env.API_JWT_SECRET ?? ''
const API_USER_ID = process.env.API_USER_ID ?? ''
const API_USER_PASS = process.env.API_USER_PASS ?? ''
const API_SERVER_PORT = +(process.env.API_SERVER_PORT ?? '8080')
const API_BASE_PATH = process.env.API_BASE_PATH ?? ''
const API_ORIGIN = process.env.API_ORIGIN ?? ''
const API_UPLOAD_DIR = process.env.API_UPLOAD_DIR ?? ''
const TYPEORM_HOST = process.env.TYPEORM_HOST ?? ''
const TYPEORM_USERNAME = process.env.TYPEORM_USERNAME ?? ''
const TYPEORM_PASSWORD = process.env.TYPEORM_PASSWORD ?? ''
const TYPEORM_DATABASE = process.env.TYPEORM_DATABASE ?? ''
const TYPEORM_PORT = process.env.TYPEORM_PORT ?? ''

export {
  API_JWT_SECRET,
  API_USER_ID,
  API_USER_PASS,
  API_SERVER_PORT,
  API_BASE_PATH,
  API_ORIGIN,
  API_UPLOAD_DIR,
  TYPEORM_HOST,
  TYPEORM_USERNAME,
  TYPEORM_PASSWORD,
  TYPEORM_DATABASE,
  TYPEORM_PORT
}
