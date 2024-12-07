const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    open: true,
    port: 4000,
    client: {
      overlay: {
        errors: true,
        warnings: true,
      },
      webSocketURL: {
        pathname: '/ws',
        port: 4000,  
      },
    },
    compress: true,
  },
});
