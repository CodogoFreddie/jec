"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _redux = require("redux");

var _reduxScuttlebot = require("redux-scuttlebot");

var _reduxScuttlebot2 = _interopRequireDefault(_reduxScuttlebot);

var _reduxSaga = require("redux-saga");

var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

var _reducers = require("./reducers");

var reducers = _interopRequireWildcard(_reducers);

var _sagas = require("./sagas");

var _sagas2 = _interopRequireDefault(_sagas);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(saga);

var sagaMiddleware = (0, _reduxSaga2.default)();

var _createReduxScuttlebo = (0, _reduxScuttlebot2.default)({
	listenToActionTypes: ["SET_TEST_STATE"]
}),
    scuttlebotMiddleware = _createReduxScuttlebo.scuttlebotMiddleware,
    scuttlebotReducers = _createReduxScuttlebo.scuttlebotReducers,
    scuttlebotSagas = _createReduxScuttlebo.scuttlebotSagas;

var reducer = (0, _redux.combineReducers)(Object.assign({}, reducers, scuttlebotReducers));

function saga() {
	return _regenerator2.default.wrap(function saga$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					return _context.delegateYield(scuttlebotSagas, "t0", 1);

				case 1:
					return _context.delegateYield(_sagas2.default, "t1", 2);

				case 2:
				case "end":
					return _context.stop();
			}
		}
	}, _marked, this);
}

var store = (0, _redux.createStore)(reducer, (0, _redux.applyMiddleware)(sagaMiddleware, scuttlebotMiddleware));

sagaMiddleware.run(saga);

console.log(store.getState());

store.dispatch({
	type: "SET_TEST_STATE",
	value: "new test state"
});

console.log(store.getState());

store.dispatch({
	type: "NOOP"
});

console.log(store.getState());