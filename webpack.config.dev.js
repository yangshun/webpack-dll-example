const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const common = require('./webpack.config.common');
const dll = require('./webpack.config.dll');

const devServerConfig = {
  watchOptions: {
    // Delay the rebuild after the first change.
    aggregateTimeout: 300,
    // Poll using interval (in ms, accepts boolean too).
    poll: 1000,
  },
  devServer: {
    // Enable history API fallback so HTML5 History API based
    // routing works. This is a good default that will come
    // in handy in more complicated setups.
    historyApiFallback: true,
    // Unlike the cli flag, this doesn't set
    // HotModuleReplacementPlugin!
    hot: true,
    inline: true,
    stats: { color: true },
  },
  plugins: [
    // Enable multi-pass compilation for enhanced performance
    // in larger projects. Good default.
    new webpack.HotModuleReplacementPlugin({
      multiStep: true,
    }),
  ],
};

let dllPlugins = [];
let dllHtmlWebpackConfig = {};
const args = process.argv.slice(2);

// Disable using of dll if -no-dll cli flag is present.
if (args.indexOf('-no-dll') === -1) {
  dllPlugins = dllPlugins.concat(Object.keys(dll.DLL_ENTRIES).map(function (entryName) {
    return new webpack.DllReferencePlugin({
      context: '.',
      manifest: require(path.join(common.PATHS.dll, dll.DLL_MANIFEST_FILE_FORMAT.replace(/\[name\]/g, entryName)))
    });
  }));
  // `dll` is our self-defined option to pass the paths of the built dll files
  // to the HTML template. The dll JavaScript files are loaded in <script> tags
  // within the template to be made available to the application.
  dllHtmlWebpackConfig = {
    dll: {
      paths: Object.keys(dll.DLL_ENTRIES).map(function (entryName) {
        return path.join(common.DLL, dll.DLL_FILE_FORMAT.replace(/\[name\]/g, entryName));
      }),
    },
  };
}

const config = merge(
  common,
  {
    devtool: 'eval-source-map',
    plugins: [].concat(
      new HtmlWebpackPlugin(Object.assign({},
        {
          // We use ejs because there's custom logic required to include the dll script tags.
          template: path.join(common.PATHS.app, 'index.ejs'),
          cache: true,
          chunks: ['app'],
        },
        dllHtmlWebpackConfig
      )),
      dllPlugins,
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
      })
    ),
  },
  devServerConfig
);

module.exports = config;
