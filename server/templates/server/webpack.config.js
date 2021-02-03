const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const NodemonPlugin = require('nodemon-webpack-plugin')

module.exports = {
  entry: {
    index: './entrypoints/index.ts'<% if (serverless === 'lambda') { %>,
    lambda: './entrypoints/lambda.ts',
    lambda_migration: './entrypoints/lambda_migration.ts'<% } %>
  },
  target: 'node',
  node: {
    __dirname: false
  },
  output: {
    filename: '[name].js',
    path: __dirname
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }]
  },
  plugins: [new NodemonPlugin()],
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()]
  },
  externals: [nodeExternals()]
}
