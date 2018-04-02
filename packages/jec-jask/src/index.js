import * as R from "ramda";

import { createStore, applyMiddleware, combineReducers, } from 'redux'

import createReduxDistribute from "redux-distribute";
import createSagaMiddleware from 'redux-saga'
import { persistStore, persistReducer, } from 'redux-persist'

import * as reducers from "./reducers";

const createJecJaskStore = ({
	persistStorage,
}) => {
	const cacheFolder = process.env.JEC_JASK_CACHE_FOLDER || `${require('os').homedir()}/.jecJaskCache`;
	const reducer = combineReducers(reducers);

	const persistConfig = {
		key: 'root',
		storage: persistStorage,
	}
	const persistedReducer = persistReducer(persistConfig, reducer)

	const store = createStore(
		persistedReducer,
		applyMiddleware( store => next => action => { console.log("action", action); next(action) } ),
	)

	persistStore(store)

	return store
}

export default createJecJaskStore;
