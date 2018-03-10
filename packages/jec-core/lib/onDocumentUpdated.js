"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function onDocumentUpdated(docId, doc) {
	console.log("onDocumentUpdated", docId);
	if (docId === this.rootKey) {
		this.setState({
			config: doc
		});
	} else {
		this.setState({
			data: (0, _defineProperty3.default)({}, docId, doc)
		});
	}
}

exports.default = onDocumentUpdated;