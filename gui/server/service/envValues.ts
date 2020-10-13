import dotenv from 'dotenv'

dotenv.config()

const SERVER_PORT = +(process.env.SERVER_PORT ?? '8080')
const BASE_PATH = process.env.BASE_PATH ?? ''
const API_ORIGIN = process.env.API_ORIGIN ?? ''

export { SERVER_PORT, BASE_PATH, API_ORIGIN }
