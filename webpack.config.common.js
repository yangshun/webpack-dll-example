const path = require('path');

const SRC = 'src';
const BUILD = 'build';
const DLL = 'dll';
const PATHS = {
  app: path.join(__dirname, SRC),
  scripts: path.join(__dirname, SRC, 'js'),
  build: path.join(__dirname, BUILD),
  dll: path.join(__dirname, DLL),
};

// These dependencies will be extracted out into `vendor.js` in production build.
// App bundle changes more often than vendor bundles and splitting app bundle from
// 3rd-party vendor bundle allows the vendor bundles to be cached.
const VENDOR = [
  'react',
  'react-dom',
  'react-autobind',
  'react-router',
  'redux',
  'react-redux',
  'react-router-redux',
  'redux-logger',
  'redux-thunk',
];

const common = {
  // This tells Webpack where to look for modules.
  resolve: {
    // Specify a few root paths when importing our own modules,
    // so that we can use absolute paths in our imports.
    // E.g. Importing our own module at `/js/path/to/module` will simply be:
    // `import module from 'path/to/module;`
    root: [
      PATHS.app,
      PATHS.scripts,
    ],
    // Importing modules from these files will not require the extension.
    extensions: ['', '.js', '.jsx', '.json'],
    moduleDirectories: ['node_modules'],
  },
  // Entry accepts a path or an object of entries.
  // We'll be using the latter form given it's
  // convenient with more complex configurations.
  entry: {
    // This will build an app.js file from the `main` module.
    app: ['main'],
  },
  output: {
    path: PATHS.build,
    filename: '[name].js',
  },
  module: {
    loaders: [
      {
        // Process js and jsx files using Babel.
        test: /\.(js|jsx)$/,
        // Parse only our own js files! Without this it will go through
        // the node_modules code.
        include: PATHS.scripts,
        loader: 'babel',
        query: {
          // Enable caching for improved performance during development
          // It uses default OS directory by default. If you need
          // something more custom, pass a path to it.
          // i.e., cacheDirectory: <path>
          cacheDirectory: true,
          presets: ['es2015', 'react'],
        },
      },
    ],
  },
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};

module.exports = common;
module.exports.PATHS = PATHS;
module.exports.DLL = DLL;
module.exports.VENDOR = VENDOR;
