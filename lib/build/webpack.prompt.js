"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.promtModuleToLoadInServer = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.array.filter.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.match.js");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fs = _interopRequireDefault(require("fs"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _fuzzy = _interopRequireDefault(require("fuzzy"));

var _this = void 0;

_inquirer.default.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

var promtModuleToLoadInServer = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(folderSourcePath) {
    var moduleName, promptChoices, allFoldersList, folderList, answerSelected;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            promptChoices = function promptChoices(subDirArr) {
              var searchModules = function searchModules(answers) {
                var input = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
                return new Promise(function (resolve) {
                  var fuzzyResult = _fuzzy.default.filter(input, subDirArr);

                  resolve(fuzzyResult.map(function (el) {
                    return el.original;
                  }));
                });
              };

              var promptData = [{
                type: 'autocomplete',
                name: 'folder',
                message: 'Which view you want to run ? ',
                pageSize: 10,
                source: searchModules
              }];
              return promptData;
            };

            allFoldersList = _fs.default.readdirSync(folderSourcePath);
            console.log(allFoldersList);
            folderList = allFoldersList.filter(function (subDir) {
              return !subDir.match('.js|.ts');
            });

            if (!(folderList.length > 0)) {
              _context.next = 9;
              break;
            }

            _context.next = 7;
            return _inquirer.default.prompt(promptChoices(folderList)).then(function (answer) {
              return answer;
            }).catch(function (err) {
              console.log(err);
              console.log('something wrong, please load from specific path.');
              console.log("please run server from ".concat(_this.buildrc.appType, " you want to load.."));
              return err;
            });

          case 7:
            answerSelected = _context.sent;
            moduleName = answerSelected.folder;

          case 9:
            return _context.abrupt("return", moduleName);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function promtModuleToLoadInServer(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.promtModuleToLoadInServer = promtModuleToLoadInServer;