import * as R from "ramda";
import { PERSIST, REHYDRATE, } from "redux-persist";

import { createStore, applyMiddleware, combineReducers, } from "redux";

import createReduxDistribute from "redux-distribute";
import createSagaMiddleware from "redux-saga";
import { persistStore, persistReducer, } from "redux-persist";

import * as reducers from "./reducers";

export * from "./collateObjects";

const createJecJaskStore = ({
	listAllActions,
	writeAction,
	readAction,
	persistStorage,
}) => {
	const persistConfig = {
		key: "root",
		storage: persistStorage,
		//blacklist: [ "__distributeStatus", ],
	};

	const {
		distributeSaga,
		distributeReducers,
		distributeMiddleware,
	} = createReduxDistribute({
		listAllActions,
		writeAction,
		readAction,
		persistConfig,
	});

	const reducer = combineReducers({
		...reducers,
		...distributeReducers,
	});

	const persistedReducer = persistReducer(persistConfig, reducer);
	const sagaMiddleware = createSagaMiddleware();

	const store = createStore(
		persistedReducer,
		applyMiddleware(
			distributeMiddleware,
			sagaMiddleware,
			//store => next => action => {
				//console.log("action", action.type);
				//next(action);
			//},
		),
	);

	sagaMiddleware.run(distributeSaga);

	persistStore(store);

	return store;
};

export default createJecJaskStore;
