import dotenv from 'dotenv'

dotenv.config({ path: 'server/.env' })

const USER_ID = process.env.USER_ID ?? ''
const USER_PASS = process.env.USER_PASS ?? ''
const SERVER_PORT = process.env.SERVER_PORT ?? ''
const BASE_PATH = process.env.BASE_PATH ?? ''

export { USER_ID, USER_PASS, SERVER_PORT, BASE_PATH }
