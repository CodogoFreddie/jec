import * as R from "ramda";
import { PERSIST, REHYDRATE } from "redux-persist";

import { applyMiddleware, combineReducers, createStore } from "redux";

import createReduxDistributeStoreEnhancer from "redux-distribute";
import createSagaMiddleware from "redux-saga";
import { persistReducer, persistStore } from "redux-persist";
import createRecurenceActionsMiddleware from "./createRecurenceActionsMiddleware";

import * as reducers from "./reducers";
export * from "./collateObjects";

const createJecJaskStore = handlers => {
	const reducer = combineReducers({
		...reducers,
	});

	const reduxDistrubteEnhancer = createReduxDistributeStoreEnhancer(handlers);

	const store = createStore(
		reducer,
		R.compose(
			applyMiddleware(createRecurenceActionsMiddleware),
			reduxDistrubteEnhancer,
		),
	);

	return store;
};

export default createJecJaskStore;
