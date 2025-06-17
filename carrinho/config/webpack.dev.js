const { merge } = require('webpack-merge');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const commonConfig = require('./webpack.common');
const deps = require('../package.json').dependencies;

const devConfig = {
  mode: 'development',
  output: { 
    publicPath: 'http://localhost:8081/',
    filename: '[name].js',
  },
  devServer: { 
    port: 8081, 
    historyApiFallback: { index: 'index.html' },
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'carrinho',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/bootstrap',
      },
      shared: {
        ...deps,
        react: { 
          singleton: true, 
          requiredVersion: deps.react,
          eager: false
        },
        'react-dom': { 
          singleton: true, 
          requiredVersion: deps['react-dom'],
          eager: false
        },
        'react-router-dom': { 
          singleton: true, 
          requiredVersion: deps['react-router-dom'],
          eager: false
        },
        '@mui/material': { 
          singleton: true, 
          requiredVersion: deps['@mui/material'],
          eager: false
        },
        '@emotion/react': { 
          singleton: true, 
          requiredVersion: deps['@emotion/react'],
          eager: false
        },
        '@emotion/styled': { 
          singleton: true, 
          requiredVersion: deps['@emotion/styled'],
          eager: false
        }
      },
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);