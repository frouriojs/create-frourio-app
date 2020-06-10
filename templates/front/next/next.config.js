const frourioConfig = require('./server/frourio.config')

module.exports = {
  env: {
    baseURL:
      process.env.NODE_ENV === 'production'
        ? frourioConfig.basePath
        : `http://localhost:${frourioConfig.port}${frourioConfig.basePath}`
  }
}
