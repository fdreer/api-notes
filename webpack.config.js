const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: 'development',
  entry: {
    index: './src/main.ts',
  },
  output: {
    path: path.join(__dirname, '/build'),
    filename: 'main.js',
    publicPath: '/',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: [/node_modules/, /__test__/],
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
  },
  externals: [nodeExternals()],
}
