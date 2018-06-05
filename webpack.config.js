const path = require('path');

const DIST_DIR = path.resolve(`${__dirname}`, 'dist');
const SRC_DIR = path.resolve(`${__dirname}`, 'client');

const config = {
  devtool: 'cheap-eval-source-map',
  mode: 'development',
  entry: [`${SRC_DIR}/app/index.jsx`, `${SRC_DIR}/app/chatroom.jsx`],
  output: {
    path: `${DIST_DIR}/app`,
    filename: 'bundle.js',
    publicPath: '/app/',
  },
  module: {
    rules: [
      {
        test: /\.js?/,
        include: SRC_DIR,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-2'],
        },
      },
    ],
  },
};

module.exports = config;
