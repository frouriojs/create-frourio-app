const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const NodemonPlugin = require('nodemon-webpack-plugin')

module.exports = {
  entry: {
    'server/index': './server/index.ts',
    'server/generator/saofile': './server/generator/index.ts',
    'server/snapshot/index': './server/snapshot/index.ts',
    'server/snapshot/saofile': './server/snapshot/sao.ts'
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
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({ configFile: 'server/tsconfig.json' })]
  },
  externals: [nodeExternals()]
}
