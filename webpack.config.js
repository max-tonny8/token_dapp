const path = require("path");
const CopyWebpack = require("copy-webpack-plugin");
const webpack = require('webpack');

module.exports = {
  entry: "./app/src/index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "app/dist"),
  },
  plugins: [
    new CopyWebpack({
      patterns: [
        {from: "./app/src/index.html", to: "index.html"}
      ]
    }),
    new webpack.ProvidePlugin({
      process: 'process',
      Buffer: ['buffer', 'Buffer']
    }),
  ],
  resolve: {
    modules: [path.resolve(__dirname, 'app'), 'node_modules'],
    fallback: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      https: 'https-browserify',
      os: 'os-browserify',
      http: 'stream-http'
    }
  },
  devServer: { contentBase: path.join(__dirname, "app", "dist"), compress: true },
};