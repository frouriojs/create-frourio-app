const { nodeExternalsPlugin } = require('esbuild-node-externals')
const path = require('path')

const root = process.cwd()

module.exports = {
  entryPoints: [path.resolve(root, './entrypoints/index.ts')],
  outfile: path.resolve(root, './index.js'),
  platform: 'node',
  bundle: true,
  plugins: [nodeExternalsPlugin()],
  logLevel: 'info'
}