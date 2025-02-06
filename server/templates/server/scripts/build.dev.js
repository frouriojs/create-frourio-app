const { context } = require('esbuild')
const config = require('./config.dev.js')

context(config).then((ctx) => ctx.watch())
