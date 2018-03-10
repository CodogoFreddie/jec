"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _hyperdb = require("hyperdb");

var _hyperdb2 = _interopRequireDefault(_hyperdb);

var _v = require("uuid/v4");

var _v2 = _interopRequireDefault(_v);

var _ramda = require("ramda");

var R = _interopRequireWildcard(_ramda);

var _onPeerJoined = require("./onPeerJoined");

var _onPeerJoined2 = _interopRequireDefault(_onPeerJoined);

var _joinSwarm = require("./joinSwarm");

var _joinSwarm2 = _interopRequireDefault(_joinSwarm);

var _onRootReady = require("./onRootReady");

var _onRootReady2 = _interopRequireDefault(_onRootReady);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Jec = function () {
	function Jec(storage, rootKey) {
		var _this = this;

		(0, _classCallCheck3.default)(this, Jec);

		this.rootKey = rootKey;
		this.listener = function () {};
		this.state = {};

		if (!this.rootKey) {
			this.rootKey = (0, _v2.default)();
		}

		this.dbRoot = (0, _hyperdb2.default)(storage, this.rootKey);

		this.dbRoot.on("ready", function () {
			_this.dbRoot.watch("/", function () {
				for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
					args[_key] = arguments[_key];
				}

				console.log(args);
				//this.dbRoot.get("/name", (err, nodes) => {
				//nodes.forEach( (node, i) => {
				//console.log(i, node.value.toString("utf8"))
				//})
				//})
			});

			console.log("ready");
			_this.dbRoot.put("/name", "this is my name", function () {
				_this.dbRoot.put("/name", "this is my quest", function () {
					_this.dbRoot.get("/name", function (err, nodes) {
						nodes.forEach(function (node, i) {
							console.log(i, node.value.toString("utf8"));
						});
					});
				});
			});
		});
	}

	//setState({ config, data, }){
	//if(config){
	//this.state = R.merge(
	//this.state,
	//{ config }
	//);
	//}

	//this.listener(this.state);
	//}

	//createNewWorkspace(){
	//console.log(`creating new workspace`);
	//this.hm.create();
	//}

	(0, _createClass3.default)(Jec, [{
		key: "onUpdate",
		value: function onUpdate(listener) {
			this.listener = listener;
		}
	}]);
	return Jec;
}();

exports.default = Jec;