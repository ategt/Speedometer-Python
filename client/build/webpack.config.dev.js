'use strict'
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  mode: 'development',
  entry: [
    './source/main.js'
  ],
  devtool: "eval-cheap-module-source-map",
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
      },
      {
        test: /\.(png|jpe?g|gif|flv|mp4|ogg)$/i,
        loader: 'file-loader',
        options: {
          outputPath: 'media',
        },
      },
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
};