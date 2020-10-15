const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const NodemonPlugin = require('nodemon-webpack-plugin')

module.exports = {
  entry: {
    index: './index.ts',
    'generator/saofile': './generator/index.ts'
  },
  target: 'node',
  node: {
    __dirname: false
  },
  output: {
    filename: '[name].js',
    path: __dirname,
    libraryExport: 'default',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }]
  },
  plugins: [new NodemonPlugin({ script: './index.js', watch: './index.js' })],
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()]
  },
  externals: [nodeExternals()]
}
