import * as R from "ramda";

import { applyMiddleware, combineReducers, createStore } from "redux";

import createReduxDistributeStoreEnhancer from "redux-distribute";
import createRecurenceActionsMiddleware from "./createRecurenceActionsMiddleware";

import * as reducers from "./reducers";
export * from "./collateObjects";

const createJecJaskStore = handlers => {
	const reducer = combineReducers({
		...reducers,
	});

	const reduxDistrubteEnhancer = createReduxDistributeStoreEnhancer(handlers);

	const composeEnhancers =
		window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || R.compose;

	const store = createStore(
		reducer,
		composeEnhancers(
			applyMiddleware(createRecurenceActionsMiddleware),
			reduxDistrubteEnhancer,
		),
	);

	return store;
};

export default createJecJaskStore;
