const { merge } = require('webpack-merge');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const commonConfig = require('./webpack.common');
const shared = require('../package.json').dependencies;

const domain = process.env.PRODUCTION_DOMAIN

const devConfig = {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
    publicPath: '/app/latest/'
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'app',
      remotes: {
        carrinho: `carrinho@${domain}/carrinho/latest/remoteEntry.js`,
        produtos: `produtos@${domain}/produtos/latest/remoteEntry.js`,
      },
      shared,
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);