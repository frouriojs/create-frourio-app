require('dotenv').config()

module.exports = {
  env: {
    baseURL: `http://localhost:${process.env.PORT}${process.env.BASE_PATH}`
  }
}
