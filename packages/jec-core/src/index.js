import { createStore, applyMiddleware, combineReducers, } from "redux";
import createReduxScuttlebot from "redux-scuttlebot"
import createSagaMiddleware from 'redux-saga'

import * as reducers from './reducers'
import sagas from './sagas'

const sagaMiddleware = createSagaMiddleware()

const { 
	scuttlebotMiddleware,
	scuttlebotReducers,
	scuttlebotSagas,
} = createReduxScuttlebot({
	listenToActionTypes: [
		"SET_TEST_STATE",
	],
});

const reducer = combineReducers({
	...reducers,
	...scuttlebotReducers,
});

function* saga(){
	yield* scuttlebotSagas;
	yield* sagas;
}

const store = createStore(
	reducer,
	applyMiddleware(sagaMiddleware, scuttlebotMiddleware)
)

sagaMiddleware.run(saga);

console.log(store.getState());

store.dispatch({
	type: "SET_TEST_STATE",
	value: "new test state",
});

console.log(store.getState());

store.dispatch({
	type: "NOOP",
});

console.log(store.getState());
