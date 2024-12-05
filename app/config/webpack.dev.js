const { merge } = require('webpack-merge');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const commonConfig = require('./webpack.common');
const shared = require('../package.json').dependencies;

const devConfig = {
  mode: 'development',
  output: { publicPath: 'http://localhost:8083/' },
  devServer: { port: 8083, historyApiFallback: { index: 'index.html' } },
  plugins: [
    new ModuleFederationPlugin({
      name: 'app',
      remotes: {
        carrinho: 'carrinho@http://localhost:8081/remoteEntry.js',
        produtos: 'produtos@http://localhost:8082/remoteEntry.js',
      },
      shared,
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);