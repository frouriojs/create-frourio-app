const config = require('./config.common')

module.exports = Object.assign(config, {
  define: {
    'process.env.NODE_ENV': `"development"`
  }
})
