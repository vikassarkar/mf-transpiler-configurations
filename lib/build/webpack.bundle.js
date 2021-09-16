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
exports.getBundleConfiguration = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _path = _interopRequireDefault(require("path"));

var _miniCssExtractPlugin = _interopRequireDefault(require("mini-css-extract-plugin"));

var _webpack = require("./webpack.translator");

var _ModuleFederationPlugin = _interopRequireDefault(require("webpack/lib/container/ModuleFederationPlugin"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 *   //target: ['web', 'es5']
 *    For HMR webpack 5 - once webpack-dev-server comes try adding above line
 *    also can try removing browserslist from package.json and targets from babel.config.js file
 */
var getBundleConfiguration = function getBundleConfiguration(config) {
  var bundleEntryFile = _path.default.resolve(config.rootpath, "src/index.".concat(config.isTs ? 'ts' : 'js'));

  var bundleOutput = _path.default.resolve(config.rootpath, 'dist/');

  var configuration = {
    mode: 'production',
    entry: (0, _defineProperty2.default)({}, config.bundleName || 'index', [bundleEntryFile]),
    output: {
      path: bundleOutput,
      publicPath: '/',
      filename: '[name].min.js'
    },
    plugins: [new _miniCssExtractPlugin.default({
      filename: '[name]-style.min.css'
    })]
  };

  if (config.translatorPath) {
    configuration.plugins.push(new _webpack.MergeTranslatorPlugin({
      srcPath: config.translatorPath,
      fileName: 'translator.json',
      outFileName: 'translator.json'
    }));
  }

  if (config.mfPluginObj) {
    configuration.plugins.push(new _ModuleFederationPlugin.default(_objectSpread({}, config.mfPluginObj)));
  }

  return configuration;
};

exports.getBundleConfiguration = getBundleConfiguration;