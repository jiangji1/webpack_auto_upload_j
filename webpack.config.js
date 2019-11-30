const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = function () {
return {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
      path: path.join(__dirname, 'dabao')
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          include: path.resolve(__dirname, 'src')
        }
      ]
    }
  }
}