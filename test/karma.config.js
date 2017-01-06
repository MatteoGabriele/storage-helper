var webpackConfig = require('../config/dev');
var isTravis = !!process.env.TRAVIS

delete webpackConfig.entry

let browsers = ['PhantomJS']

/**
 * For now i can't get Travis works with this browsers.
 * Don't know how to install them!
 */
if (!isTravis) {
  browsers.push('Chrome', 'SafariPrivate')
}

module.exports = function (config) {
  config.set({
    browsers: browsers,
    singleRun: isTravis,
    frameworks: ['mocha', 'chai'],
    reporters: ['mocha'],
    files: [
      './index.js',
    ],
    plugins: [
      'karma-phantomjs-launcher',
      'karma-chai',
      'karma-mocha',
      'karma-webpack',
      'karma-mocha-reporter',
      'karma-chrome-launcher',
      'karma-safari-private-launcher',
      'karma-sourcemap-loader'
    ],
    preprocessors: {
      './index.js': ['webpack', 'sourcemap']
    },
    webpack: {
      devtool: 'inline-source-map',
      entry: './test/index.js',
      output: {
        path: __dirname,
        filename: 'test-bundle.js'
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
              retainLines: true,
              presets: ['es2015']
            },
            exclude: /node_modules/
          }
        ]
      }
    },
    webpackMiddleware: {
        noInfo: true
    }
  });
};
