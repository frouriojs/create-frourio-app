require('dotenv').config()

module.exports = {
  env: {
    BASE_URL: `http://localhost:${process.env.SERVER_PORT}${process.env.BASE_PATH}`
  }
}
