const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const NodemonPlugin = require('nodemon-webpack-plugin')

module.exports = {
  externals: [nodeExternals()],
  entry: './index.ts',
  target: 'node',
  node: {
    __dirname: false
  },
  output: {
    filename: 'index.js',
    path: __dirname
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }]
  },
  optimization: {
    minimize: false
  },
  plugins: [new NodemonPlugin()],
  resolve: {
    extensions: ['.ts'],
    plugins: [new TsconfigPathsPlugin()]
  }
}
