import createSaga from "./createSaga";
import createReducer from "./createReducer";
import createMiddleware from "./createMiddleware";

const createReduxDistribute ({
	listenToActions,
}) => ({
	saga: createSaga({
		listenToActions,
	}),
	reducer: createReducer({
		listenToActions,
	}),
	middleware: createMiddleware({
		listenToActions,
	}),
})

export default createReduxDistribute
