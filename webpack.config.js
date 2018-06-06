const path = require('path');

const DIST_DIR = path.resolve(`${__dirname}`, 'dist');

const config = {
  devtool: 'cheap-module-source-map',
  mode: 'development',
  entry: ['./client/app/index.jsx'],
  output: {
    path: `${DIST_DIR}/app`,
    filename: 'bundle.js',
    publicPath: '/app/',
    library: 'bundle.js',
    libraryTarget: 'window',
    libraryExport: 'default',
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-2'],
        },
      },
    ],
  },
};

module.exports = config;
