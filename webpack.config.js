const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/index.js',
  target: 'node',
  externals: [nodeExternals()],
  devtool: 'source-map',
  stats: {
    colors: true,
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    sourceMapFilename: 'index.js.map',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/views'),
          to: path.resolve(__dirname, 'dist/views'),
        },
      ],
      options: {
        concurrency: 100,
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
