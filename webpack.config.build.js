const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const common = require('./webpack.config.common');

const config = merge(
  common,
  {
    // Don't attempt to continue if there are any errors.
    bail: true,
    // We generate sourcemaps in production. This is slow but gives good results.
    // You can exclude the *.map files from the build during deployment.
    devtool: 'source-map',
    output: {
      // The build folder.
      path: common.PATHS.build,
      filename: '[name].[chunkhash].js',
      // This is used for require.ensure. The setup
      // will work without but this is useful to set.
      chunkFilename: '[chunkhash].js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(common.PATHS.app, 'index.ejs'),
        cache: true,
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      // Extract bundle and manifest files. Manifest is
      // needed for reliable caching.
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest'],
      }),
    ],
  }
);

module.exports = config;
