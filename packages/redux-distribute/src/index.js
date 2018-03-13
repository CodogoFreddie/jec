import createSaga from "./createSaga";
import createReducer from "./createReducer";
import createMiddleware from "./createMiddleware";

const createReduxDistribute ({
	listenToActions,
	listAllActions,
	writeAction,
	readAction,
}) => ({
	saga: createSaga({
		listenToActions,
		listAllActions,
		writeAction,
		readAction,
	}),
	reducer: createReducer({
		listenToActions,
	}),
	middleware: createMiddleware({
		listenToActions,
	}),
})

export default createReduxDistribute
