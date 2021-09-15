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
exports.getProdConfiguration = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _path = _interopRequireDefault(require("path"));

var _webpack = _interopRequireDefault(require("webpack"));

var _miniCssExtractPlugin = _interopRequireDefault(require("mini-css-extract-plugin"));

var _htmlWebpackPlugin = _interopRequireDefault(require("html-webpack-plugin"));

var _webpackManifestPlugin = require("webpack-manifest-plugin");

var _webpack2 = require("./webpack.translator");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 *   //target: ['web', 'es5']
 *    For HMR webpack 5 - once webpack-dev-server comes try adding above line
 *    also can try removing browserslist from package.json and targets from babel.config.js file
 */
var getProdConfiguration = function getProdConfiguration(config) {
  var prodEntryFile = _path.default.resolve(config.rootpath, "src/index.".concat(config.isTs ? 'tsx' : 'js'));

  var prodOutput = _path.default.resolve(config.rootpath, 'dist/');

  var sourceMapKey = "".concat(config.appType, "_mapping_1q2w3e4k");
  var configuration = {
    mode: 'production',
    entry: {
      main: config.bootstrapStyle ? [prodEntryFile, config.bootstrapStyle] : [prodEntryFile]
    },
    output: {
      path: prodOutput,
      publicPath: '/',
      filename: '[name]_[contenthash].js'
    },
    plugins: [new _htmlWebpackPlugin.default({
      template: config.htmlTemplate,
      filename: 'index.html',
      title: config.appName
    }), new _miniCssExtractPlugin.default({
      filename: '[name]-styles_[contenthash].min.css'
    }), new _webpackManifestPlugin.WebpackManifestPlugin(), new _webpack2.MergeTranslatorPlugin({
      srcPath: config.translatorPath,
      fileName: 'translator.json',
      outFileName: 'translator.json'
    }), new _webpack.default.SourceMapDevToolPlugin({
      filename: "".concat(sourceMapKey, "/[file].map[query]"),
      append: false,
      module: true,
      columns: true,
      noSources: false,
      namespace: ''
    })] // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(config.styleRootpath, './src/assets'),
    //       to: path.resolve(prodOutput, './assets')
    //     }
    //   ]
    // }),

  };

  if (config.mfPluginObj) {
    configuration.plugins.push(new ModuleFederationPlugin(_objectSpread({}, config.mfPluginObj)));
  }

  return configuration;
};

exports.getProdConfiguration = getProdConfiguration;