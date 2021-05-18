import { VueLoaderPlugin } from 'vue-loader';

module.exports = {
  mode: 'development',
  "build": "webpack --config build/webpack.config.dev.js",
  entry: [
    './source/main.js'
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
};