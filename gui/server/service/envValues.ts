import dotenv from 'dotenv'

dotenv.config()

const USER_ID = process.env.USER_ID ?? ''
const USER_PASS = process.env.USER_PASS ?? ''
const SERVER_PORT = +(process.env.SERVER_PORT ?? '8080')
const BASE_PATH = process.env.BASE_PATH ?? ''
const API_ORIGIN = process.env.API_ORIGIN ?? ''

export { USER_ID, USER_PASS, SERVER_PORT, BASE_PATH, API_ORIGIN }
