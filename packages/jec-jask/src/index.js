// @flow

import * as R from "ramda";

import { createStore, applyMiddleware, combineReducers, } from 'redux'
import type { Store as ReduxStore, Dispatch as ReduxDispatch, } from 'redux';

import createReduxDistribute from "redux-distribute";
import createSagaMiddleware from 'redux-saga'
import { persistStore, persistReducer, } from 'redux-persist'
import { AsyncNodeStorage } from 'redux-persist-node-storage'

import * as reducers from "./reducers";
import type { Action as Action_, } from "./reducers";
export type Action = Action_

import type { State as State_, } from "./storeType";
export type State = State_ 

export type GetState = () => State;
export type Dispatch = (Action) => any

export type Store = {
	getState: GetState,
	dispatch: Dispatch,
}

export type CreateJecJaskStore = () => Store
const createJecJaskStore: CreateJecJaskStore = () => {
	const cacheFolder = process.env.JEC_JASK_CACHE_FOLDER || `${require('os').homedir()}/.jecJaskCache`;
	const reducer = combineReducers(reducers);

	const persistConfig = {
		key: 'root',
		storage: new AsyncNodeStorage(cacheFolder),
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
