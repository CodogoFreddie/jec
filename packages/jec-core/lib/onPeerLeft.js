"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function onPeerLeft(peerId) {
	this.setState({
		network: (0, _defineProperty3.default)({}, peerId, false)
	});
}

exports.default = onPeerLeft;