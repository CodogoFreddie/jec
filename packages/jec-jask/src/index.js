import * as R from "ramda";
import createReduxDistribute from "redux-distribute";
import { createStore, applyMiddleware, combineReducers, } from 'redux'
import createSagaMiddleware from 'redux-saga'

function* listAllActions() {
	for(const i of [ 1,2,3, ]){
		yield Promise.resolve("MOCK_STORED_ACTION_" + i);
	}
}

const writeAction = () => Promise.resolve();
const readAction = id => Promise.resolve({
	type: "MOCK_READ_ACTION",
	timestamp: new Date(1000).toISOString(),
	salt: "salt",
	id,
});

const {
	saga: distSaga,
	reducer: distReducer,
	middleware: distMiddleware,
} = createReduxDistribute({
	listAllActions,
	writeAction,
	readAction,
});

const pruneIdsReducer = R.pipe(R.filter(Boolean), R.uniq, R.sortBy(R.identity));
const reducers = {
	ids: (state = [], action) => pruneIdsReducer([ ...state, action.id, ]),
	...distReducer,
};

function* saga(){
	yield* distSaga()
}

const reducer = combineReducers(reducers);
const sagaMiddleware = createSagaMiddleware()

const logger = store => next => action => {
	console.log("Action", action);
		next(action);
};
const store = createStore(
	reducer,
	applyMiddleware(distMiddleware, sagaMiddleware, logger)
)

sagaMiddleware.run(saga)

console.log("State", store.getState());
store.dispatch({
	type: "TYPE_1",
	id: "1",
});
console.log("State", store.getState());
store.dispatch({
	type: "ADD_DESCRIPTION",
	id: "1",
	description: "This is a discription",
});
console.log("State", store.getState());

setTimeout(
	() => console.log("\n\nFinal State", store.getState()),
	1000,
);
