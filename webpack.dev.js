const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    compress: true,
    hot: true,
    open: {
      app: {
        name: 'chrome',
      },
    },
    port: 3000,
    static: false,
  },
});
