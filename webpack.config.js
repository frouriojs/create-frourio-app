const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const NodemonPlugin = require('nodemon-webpack-plugin')

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: {
    'server/index': './server/index.ts'
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
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: { configFile: 'server/tsconfig.json' }
      }
    ]
  },
  plugins: [
    new NodemonPlugin({
      script: './server/index.js',
      watch: './server/index.js'
    })
  ],
  optimization: process.env.NODE_ENV === 'test' ? { nodeEnv: 'test' } : {},
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({ configFile: 'server/tsconfig.json' })]
  },
  externals: [nodeExternals()]
}
