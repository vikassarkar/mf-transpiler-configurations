"use strict";

require("core-js/modules/es.object.keys.js");

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.array.filter.js");

require("core-js/modules/es.object.get-own-property-descriptor.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.object.get-own-property-descriptors.js");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDevConfiguration = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

require("core-js/modules/es.array.concat.js");

var _path = _interopRequireDefault(require("path"));

var _copyWebpackPlugin = _interopRequireDefault(require("copy-webpack-plugin"));

var _miniCssExtractPlugin = _interopRequireDefault(require("mini-css-extract-plugin"));

var _htmlWebpackPlugin = _interopRequireDefault(require("html-webpack-plugin"));

var _webpack = require("./webpack.translator");

var _ModuleFederationPlugin = _interopRequireDefault(require("webpack/lib/container/ModuleFederationPlugin"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 *   //target: ['web', 'es5']
 *    For HMR webpack 5 - once webpack-dev-server comes try adding above line
 *    also can try removing browserslist from package.json and targets from babel.config.js file
 */
var getDevConfiguration = function getDevConfiguration(config, devEntry, devContainer) {
  var devOutput = _path.default.resolve(config.rootpath, 'lib/');

  var configuration = {
    mode: 'development',
    entry: {
      main: config.bootstrapStyle ? [devEntry, config.bootstrapStyle] : [devEntry]
    },
    target: 'web',
    output: {
      path: devOutput,
      publicPath: config.mfPluginObj ? "http://".concat(config.localhost, ":").concat(config.devPort, "/") : '/',
      filename: '[name]_[contenthash].js'
    },
    devtool: 'eval-cheap-module-source-map',
    watch: true,
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.css'],
      alias: {
        moduleContainer: devContainer
      }
    },
    plugins: [new _htmlWebpackPlugin.default({
      template: config.htmlTemplate,
      filename: 'index.html',
      title: config.appName
    }), new _miniCssExtractPlugin.default({
      filename: '[name]-style_[contenthash].min.css'
    }), new _webpack.MergeTranslatorPlugin({
      srcPath: config.translatorPath,
      fileName: 'translator.json',
      outFileName: 'translator.json'
    })],
    devServer: {
      stats: {
        chunks: true,
        colors: true,
        timings: true,
        errors: true
      },
      lazy: true,
      overlay: true,
      disableHostCheck: true,
      contentBase: devOutput,
      port: config.devPort,
      host: config.localhost,
      filename: 'index.html',
      compress: false,
      https: false,
      noInfo: true,
      public: undefined,
      hot: true,
      historyApiFallback: {
        disableDotRule: true
      },
      open: true,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  };

  if (config.mocksPath) {
    configuration.plugins.push(new _copyWebpackPlugin.default({
      patterns: [{
        from: config.mocksPath,
        to: _path.default.resolve(devOutput, config.envConfig.localConfigs.mockUrl || './mocks')
      }]
    }));
  }

  if (config.mfPluginObj) {
    configuration.plugins.push(new _ModuleFederationPlugin.default(_objectSpread({}, config.mfPluginObj)));
  }

  return configuration;
};

exports.getDevConfiguration = getDevConfiguration;