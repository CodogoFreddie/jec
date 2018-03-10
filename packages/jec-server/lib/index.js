"use strict";

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _jecCore = require("jec-core");

var _jecCore2 = _interopRequireDefault(_jecCore);

var _randomAccessMemory = require("random-access-memory");

var _randomAccessMemory2 = _interopRequireDefault(_randomAccessMemory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _process$argv = (0, _slicedToArray3.default)(process.argv, 3),
    _ = _process$argv[0],
    __ = _process$argv[1],
    key = _process$argv[2];

var jec = new _jecCore2.default(_randomAccessMemory2.default, key);
jec.onUpdate(function (state) {
  return console.log(JSON.stringify(state, null, 2));
});