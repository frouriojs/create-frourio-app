const { nodeExternalsPlugin } = require('esbuild-node-externals')
const path = require('path')

module.exports = {
  entryPoints: [path.resolve(__dirname, '../entrypoints/index.ts')<% if (serverless === 'lambda') { %>,
    path.resolve(__dirname, '../entrypoints/lambda.ts'),
    path.resolve(__dirname, '../entrypoints/lambda_migration.ts')<% } %>],
  outdir: path.resolve(__dirname, '../'),
  platform: 'node',
  target: 'node16',
  bundle: true,
  plugins: [nodeExternalsPlugin()],
  logLevel: 'info'
}