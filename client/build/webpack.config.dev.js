'use strict'
const { VueLoaderPlugin } = require('vue-loader');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

function resolve ( dir ) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  mode: 'development',
  entry: [
    './source/main.js'
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.join("source", "assets"), to: "assets", toType: 'dir' },
      ],
    })
  ]
};