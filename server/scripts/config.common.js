const { nodeExternalsPlugin } = require('esbuild-node-externals')
const path = require('path')

module.exports = {
  entryPoints: [path.resolve(process.cwd(), 'index.ts')],
  outdir: process.cwd(),
  platform: 'node',
  target: 'node20',
  bundle: true,
  plugins: [nodeExternalsPlugin()],
  sourcemap: 'inline'
}
