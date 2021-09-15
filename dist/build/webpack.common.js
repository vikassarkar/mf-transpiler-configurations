"use strict";

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.array.filter.js");

require("core-js/modules/es.object.get-own-property-descriptor.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.object.get-own-property-descriptors.js");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebpackBuild = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.object.keys.js");

require("core-js/modules/es.array.includes.js");

require("core-js/modules/es.string.includes.js");

require("core-js/modules/es.array.concat.js");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _webpack = _interopRequireDefault(require("webpack"));

var _webpackDevServer = _interopRequireDefault(require("webpack-dev-server"));

var _miniCssExtractPlugin = _interopRequireDefault(require("mini-css-extract-plugin"));

var _eslintWebpackPlugin = _interopRequireDefault(require("eslint-webpack-plugin"));

var _terserWebpackPlugin = _interopRequireDefault(require("terser-webpack-plugin"));

var _cleanWebpackPlugin = require("clean-webpack-plugin");

var _webpackManifestPlugin = require("webpack-manifest-plugin");

var _webpackMerge = require("webpack-merge");

var _webpack2 = require("./webpack.prompt");

var _webpack3 = require("./webpack.dev");

var _webpack4 = require("./webpack.prod");

var _webpack5 = require("./webpack.bundle");

var _babelConfig = _interopRequireDefault(require("../../global/babel.config.js"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 *   //target: ['web', 'es5']
 *    For HMR webpack 5 - once webpack-dev-server comes try adding above line
 *    also can try removing browserslist from package.json and targets from babel.config.js file
 */
var WebpackBuild = /*#__PURE__*/function () {
  function WebpackBuild(params) {
    (0, _classCallCheck2.default)(this, WebpackBuild);
    this.config = {
      // root path of application
      rootpath: params.rootpath,
      // application type (container/module/widget)
      appType: params.appType,
      // application name 
      appName: params.appName || this.getRootFolderName(params.rootpath),
      // environment type (development/production)
      env: params.env,
      // build process for typescript application
      isTs: params.isTs,
      // localhost url for dev environment
      localhost: params.localhost || 'localhost.specialurl.com',
      // port for local dev environment
      devPort: params.port,
      // path for html template for build 
      htmlTemplate: params.htmlTemplate,
      // main entry file path for launching widgets individually
      devLauncherFile: params.devLauncherFile,
      // es-lint path for es-lint rules
      eslint: _path.default.resolve(__dirname, '../../global/eslintrc.json'),
      // bundle name for production bundle  
      bundleName: params.bundleName,
      // path of translator ie usually widget for combining all il18 json
      translatorPath: params.translatorPath,
      // webpack module fedration configuration for microfrontend build
      mfPluginObj: params.mfPluginObj,
      // path for mocks in dev environment
      mocksPath: params.mocksPath,
      // all configuration for build process 
      envConfig: params.envConfig,
      // bootstrap style if required in build
      bootstrapStyle: params.bootstrapStyle ? 'bootstrap/dist/css/bootstrap.min.css' : null,
      // assets path for images and fonts
      styleAssets: '/assets/',
      // style rooth path for adding styling if not imported in js files
      styleRootpath: _path.default.resolve(params.rootpath, params.styleRootpath)
    };
  }

  (0, _createClass2.default)(WebpackBuild, [{
    key: "getRootFolderName",
    value: function getRootFolderName(roothpath) {
      return 'React-microfrontend';
    }
  }, {
    key: "getProjectEnv",
    value: function getProjectEnv() {
      var projectConfig = _objectSpread({}, this.config.envConfig);

      projectConfig.localConfigs.isMock = this.config.env === 'development';
      projectConfig.localConfigs.devTool = this.config.env === 'development';
      return projectConfig;
    }
  }, {
    key: "getCommonConfiguration",
    value: function getCommonConfiguration() {
      return {
        mode: '',
        output: {},
        devtool: false,
        watch: false,
        cache: false,
        resolve: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.css'],
          alias: {}
        },
        module: {
          rules: [{
            test: /\.(js|jsx|ts|tsx)?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: _babelConfig.default
            }
          }, {
            test: /\.(scss|css)$/,
            use: [{
              loader: _miniCssExtractPlugin.default.loader
            }, 'css-loader', 'sass-loader']
          }, {
            test: /\.json$/,
            loader: 'json-loader',
            type: 'javascript/auto'
          }, {
            test: /\.html$/,
            use: ['raw-loader']
          }, {
            test: /\.(gif|png|jpe?g)$/i,
            use: {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets/images/'
              }
            }
          }, {
            test: /\.(woff|woff2|eot|[ot]tf)$/i,
            use: {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets/fonts/'
              }
            }
          }, {
            test: /\.svg$/,
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: function outputPath(filename, filePath) {
                if (filePath.indexOf('images') > -1) {
                  return "assets/images/".concat(filename);
                }

                if (filePath.indexOf('fonts') > -1) {
                  return "assets/fonts/".concat(filename);
                }

                return "assets/".concat(filename);
              }
            }
          }]
        },
        plugins: [new _webpack.default.DefinePlugin({
          'process.env': {
            ENV_VAR: JSON.stringify(this.getProjectEnv()),
            APP_TYPE: JSON.stringify(this.config.appType),
            BUILD_TYPE: JSON.stringify(this.config.env)
          }
        }), new _webpack.default.ProgressPlugin(), new _cleanWebpackPlugin.CleanWebpackPlugin({
          verbose: true
        }), new _eslintWebpackPlugin.default({
          extensions: ['js', 'jsx', 'ts', 'tsx'],
          emitError: true,
          emitWarning: true,
          failOnError: true,
          context: this.config.rootpath
        })],
        optimization: {
          minimizer: [new _terserWebpackPlugin.default({
            extractComments: false,
            terserOptions: {
              format: {
                comments: false
              }
            }
          })],
          moduleIds: 'deterministic',
          chunkIds: 'named',
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              // for prod / dev container chunks utils, services, components, widgets, pages
              // for bundle/dev pages chunks utils, services, components, widgets
              // for bundle/dev widgets chunks utils, services, components
              // for bundle services chunks utils 
              bootstrap: {
                test: /[\\/]node_modules[\\/]bootstrap[\\/]/,
                name: 'bootstrap',
                priority: 10,
                reuseExistingChunk: true
              },
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendor',
                priority: 20,
                reuseExistingChunk: true
              }
            }
          }
        }
      };
    }
  }, {
    key: "displayWebpackStats",
    value: function displayWebpackStats(err, stats) {
      if (err) {
        console.error("".concat(err));
      } else {
        console.log("".concat(stats.toString({
          chunks: true,
          colors: true,
          assetsSort: 'size',
          entrypoints: false
        })));
      }
    }
  }, {
    key: "startProductionBuild",
    value: function startProductionBuild() {
      var commonConfiguration = this.getCommonConfiguration();
      var prodConfiguration = (0, _webpack4.getProdConfiguration)(this.config);
      var configuration = (0, _webpackMerge.merge)(commonConfiguration, prodConfiguration);
      var compiler = (0, _webpack.default)(configuration, this.displayWebpackStats);

      var _getCompilerHooks = (0, _webpackManifestPlugin.getCompilerHooks)(compiler),
          beforeEmit = _getCompilerHooks.beforeEmit;

      beforeEmit.tap('newMainfiest', function (manifest) {
        var newMainfiest = {};
        Object.keys(manifest).map(function (keyName) {
          if (!keyName.includes('.js.map')) {
            newMainfiest[keyName] = manifest[keyName];
          }

          return true;
        });
        return newMainfiest;
      });
    }
  }, {
    key: "startBundling",
    value: function startBundling() {
      var commonConfiguration = this.getCommonConfiguration();
      var bundleConfiguration = (0, _webpack5.getBundleConfiguration)(this.config);
      var configuration = (0, _webpackMerge.merge)(commonConfiguration, bundleConfiguration);
      (0, _webpack.default)(configuration, this.displayWebpackStats);
    }
  }, {
    key: "startDevelopementServer",
    value: function () {
      var _startDevelopementServer = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var devEntry, devContainer, moduleName, _this$config, rootpath, appType, devLauncherFile, commonConfiguration, devConfiguration, configuration, server;

        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this$config = this.config, rootpath = _this$config.rootpath, appType = _this$config.appType, devLauncherFile = _this$config.devLauncherFile;
                _context.t0 = appType;
                _context.next = _context.t0 === 'widgets' ? 4 : _context.t0 === 'container' ? 10 : _context.t0 === 'module' ? 10 : 13;
                break;

              case 4:
                _context.next = 6;
                return (0, _webpack2.promtModuleToLoadInServer)(_path.default.resolve(rootpath, 'src'));

              case 6:
                moduleName = _context.sent;
                devEntry = devLauncherFile;
                devContainer = _path.default.resolve(rootpath, "src/".concat(moduleName, "/index.").concat(this.config.isTs ? 'ts' : 'js'));
                return _context.abrupt("break", 15);

              case 10:
                devEntry = _path.default.resolve(rootpath, "src/index.".concat(this.config.isTs ? 'tsx' : 'js'));
                devContainer = _path.default.resolve(rootpath, "src/router/MainAppRouter.".concat(this.config.isTs ? 'tsx' : 'js'));
                return _context.abrupt("break", 15);

              case 13:
                devEntry = '';
                devContainer = '';

              case 15:
                commonConfiguration = this.getCommonConfiguration();
                devConfiguration = (0, _webpack3.getDevConfiguration)(this.config, devEntry, devContainer);
                configuration = (0, _webpackMerge.merge)(commonConfiguration, devConfiguration);
                server = new _webpackDevServer.default((0, _webpack.default)(configuration, this.displayWebpackStats), configuration.devServer);
                server.listen(configuration.devServer.port, configuration.devServer.host, function (err) {
                  if (err) {
                    console.error(err);
                  } else {
                    console.log('');
                    console.log(" ****************************************** ");
                    console.log(" ************ Server running at ***********");
                    console.log("http://".concat(configuration.devServer.host, ":").concat(configuration.devServer.port));
                    console.log(" ****************************************** ");
                  }
                });

              case 20:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function startDevelopementServer() {
        return _startDevelopementServer.apply(this, arguments);
      }

      return startDevelopementServer;
    }()
  }, {
    key: "runBuildProcess",
    value: function runBuildProcess() {
      switch (this.config.env) {
        case 'development':
          this.startDevelopementServer();
          break;

        case 'production':
          if (this.config.bundleName) {
            this.startBundling();
            break;
          }

          this.startProductionBuild();
          break;

        default:
          throw new Error('No matching configuration was found!');
      }
    }
  }]);
  return WebpackBuild;
}();

exports.WebpackBuild = WebpackBuild;