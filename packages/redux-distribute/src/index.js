import createSaga from "./createSaga";
import createReducer from "./createReducer";
import createMiddleware from "./createMiddleware";

const createReduxDistribute = ({
	listenToActions,
	listAllActions,
	writeAction,
	readAction,
	persistConfig,
}) => ({
	distributeSaga: createSaga({
		persistConfig,
		listenToActions,
		listAllActions,
		writeAction,
		readAction,
	}),
	distributeReducers: createReducer({
		listenToActions,
	}),
	distributeMiddleware: createMiddleware({
		listenToActions,
	}),
});

export default createReduxDistribute;
