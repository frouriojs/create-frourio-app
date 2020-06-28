require('dotenv').config()

module.exports = {
  baseURL: `${process.env.API_ORIGIN}${process.env.BASE_PATH}`
}
