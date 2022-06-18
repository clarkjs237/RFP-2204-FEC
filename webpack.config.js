const path = require('path');
const Dotenv = require('dotenv-webpack');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const config = {
  entry: ['./src/index.jsx'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    static: {
      directory: './dist',
    },
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  // plugins: [new BundleAnalyzerPlugin()],
  plugins: [new Dotenv()],
};

module.exports = config;
