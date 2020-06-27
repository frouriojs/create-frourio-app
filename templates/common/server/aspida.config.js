require('dotenv').config({ path: 'server/.env' })

module.exports = {
  baseURL: `${process.env.API_ORIGIN}${process.env.BASE_PATH}`
}
