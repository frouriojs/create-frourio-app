const { nodeExternalsPlugin } = require('esbuild-node-externals')
const path = require('path')

module.exports = {
  entryPoints: [path.resolve(__dirname, '../entrypoints/index.ts')],
  outfile: path.resolve(__dirname, '../index.js'),
  platform: 'node',
  bundle: true,
  plugins: [nodeExternalsPlugin()],
  logLevel: 'info'
}