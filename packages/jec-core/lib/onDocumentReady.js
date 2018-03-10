"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function onDocumentReady(docId, doc) {
	if (!this.rootKey) {
		console.log("jec root store created: \"" + docId + "\"");
		this.rootKey = docId;

		this.setState({
			config: doc
		});

		this.createNewWorkspace();

		return;
	}

	if (docId === this.rootKey) {
		console.log("root store is up to date");
		this.setState({
			config: doc
		});
		return;
	}

	if (!this.state.data[docId]) {
		console.log("new workspace intalised: \"" + docId + "\"");

		return this.setState({
			config: {
				workspaces: (0, _defineProperty3.default)({}, docId, true)
			},
			data: (0, _defineProperty3.default)({}, docId, doc)
		});
	}

	console.log("workspace downloaded: \"" + docId + "\"");
	return this.setState({
		data: (0, _defineProperty3.default)({}, docId, doc)
	});
}

exports.default = onDocumentReady;