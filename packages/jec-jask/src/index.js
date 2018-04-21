import * as R from "ramda";
import { PERSIST, REHYDRATE, } from "redux-persist";

import { applyMiddleware, combineReducers, createStore, } from "redux";

import createReduxDistribute from "redux-distribute";
import createSagaMiddleware from "redux-saga";
import { persistReducer, persistStore, } from "redux-persist";

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
		applyMiddleware(distributeMiddleware, sagaMiddleware),
	);

	sagaMiddleware.run(distributeSaga);

	persistStore(store);

	return store;
};

export default createJecJaskStore;
