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
exports.MergeTranslatorPlugin = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.array.join.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.object.keys.js");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var PLUGIN_NAME = 'MergeTranslatorPlugin';
var defaultOptions = {
  srcPath: null,
  fileName: '',
  outFileName: ''
};

var MergeTranslatorPlugin = /*#__PURE__*/function () {
  function MergeTranslatorPlugin(options) {
    (0, _classCallCheck2.default)(this, MergeTranslatorPlugin);
    this.options = _objectSpread(_objectSpread({}, defaultOptions), options);
  }

  (0, _createClass2.default)(MergeTranslatorPlugin, [{
    key: "processJson",
    value: function () {
      var _processJson = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(compiler, compilation, logger) {
        var translatorContent, RawSource, _this$options, srcPath, fileName, outFileName;

        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                translatorContent = {};
                RawSource = compiler.webpack.sources.RawSource;
                _this$options = this.options, srcPath = _this$options.srcPath, fileName = _this$options.fileName, outFileName = _this$options.outFileName;

                _fs.default.readdirSync(srcPath).map(function (dir) {
                  var translatorFolderPath = _path.default.join(srcPath, dir);

                  if (_fs.default.statSync(translatorFolderPath).isDirectory()) {
                    var dirNameArr = dir.split('-');

                    var translatorPath = _path.default.join(translatorFolderPath, fileName);

                    var translatorJson = JSON.parse(_fs.default.readFileSync(translatorPath, 'utf8'));
                    var availableLanguages = Object.keys(translatorJson);
                    var firstLanguage = availableLanguages[0];
                    var translatorJsonSlice = translatorJson[firstLanguage].slice_name;
                    dirNameArr.pop();
                    var translatorName = translatorJsonSlice ? translatorJsonSlice.id : dirNameArr.join('_');
                    translatorContent[translatorName] = translatorJson;
                  }

                  return true;
                });

                compilation.emitAsset(outFileName, new RawSource(JSON.stringify(translatorContent)));
                logger.info("Translator files written to: ".concat(outFileName));

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function processJson(_x, _x2, _x3) {
        return _processJson.apply(this, arguments);
      }

      return processJson;
    }()
  }, {
    key: "apply",
    value: function apply(compiler) {
      var _this = this;

      var Compilation = compiler.webpack.Compilation;
      compiler.hooks.thisCompilation.tap(PLUGIN_NAME, function (compilation) {
        compilation.hooks.processAssets.tapPromise({
          name: PLUGIN_NAME,
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
        }, /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
          var logger;
          return _regenerator.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.prev = 0;
                  logger = compilation.getLogger(PLUGIN_NAME);
                  logger.debug('Merging translator files.');
                  _context2.next = 5;
                  return _this.processJson(compiler, compilation, logger);

                case 5:
                  _context2.next = 10;
                  break;

                case 7:
                  _context2.prev = 7;
                  _context2.t0 = _context2["catch"](0);
                  compilation.errors.push(_context2.t0);

                case 10:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, null, [[0, 7]]);
        })));
      });
    }
  }]);
  return MergeTranslatorPlugin;
}();

exports.MergeTranslatorPlugin = MergeTranslatorPlugin;