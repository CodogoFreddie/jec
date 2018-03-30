// @flow

import * as R from "ramda";
import createReduxDistribute from "redux-distribute";
import { createStore, applyMiddleware, combineReducers, } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { persistStore, persistReducer, } from 'redux-persist'
import { AsyncNodeStorage } from 'redux-persist-node-storage'

import type { ReduxState, } from "./storeType";
import * as reducers from "./reducers";

//type listAllActionsType = (any) => any
//type writeActionType = (any) => any
//type readActionType = (any) => any

const generateJecJaskStore = (
	//listAllActions: listAllActionsType,
	//writeAction: writeActionType,
	//readAction: readActionType,
) => {

	const cacheFolder = process.env.JEC_JASK_CACHE_FOLDER || `${require('os').homedir()}/.jecJaskCache`;
	const reducer = combineReducers(reducers);

	const persistConfig = {
		key: 'root',
		storage: new AsyncNodeStorage(cacheFolder),
	}
	const persistedReducer = persistReducer(persistConfig, reducer)

	const store = createStore(
		persistedReducer,
	)

	persistStore(store)

	return store
}

export default generateJecJaskStore;
//const {
//saga: distSaga,
//reducer: distReducer,
//middleware: distMiddleware,
//} = createReduxDistribute({
//listAllActions,
//writeAction,
//readAction,
//});
//function* saga(){
//yield* distSaga()
//}
//const sagaMiddleware = createSagaMiddleware()
//sagaMiddleware.run(saga)
