require('dotenv').config()

module.exports = {
  env: {
    baseURL: `http://localhost:${process.env.SERVER_PORT}${process.env.BASE_PATH}`
  }
}
