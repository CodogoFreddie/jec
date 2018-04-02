import * as R from "ramda";
import { purgeStoredState, PERSIST, REHYDRATE, } from "redux-persist";
import { put, call, select, takeEvery, take, fork, } from "redux-saga/effects";

const createSaga = ({
	persistConfig,
	listenToActions,
	listAllActions,
	readAction,
	writeAction,
}) => {
	const getAllActionIds = async () => {
		const actionIds = [];
		for await (const id of listAllActions()) {
			actionIds.push(id);
		}
		return actionIds;
	};

	function* initalise() {
		const allActionIds = yield call(getAllActionIds);
		const persistedActionIds = yield select(R.prop("__distributeActions"));

		const state = yield select();

		console.log({
			state,
			allActionIds,
			persistedActionIds,
		});

		if (!R.equals(allActionIds, persistedActionIds)) {
			try {
				yield call(purgeStoredState, persistedActionIds);
			} catch (e) {}

			yield put({
				type: "REDUX_DISTRIBUTE/PURGE_ALL_STATE",
			});

			for (const id of allActionIds) {
				const action = yield call(readAction, id);

				yield put({
					...action,
					fromReduxDistributedInitialLoad: true,
				});
			}
		}

		yield put({
			type: "REDUX_DISTRIBUTE/DONE_INITIAL_LOAD",
			fromReduxDistributedInitialLoad: true,
		});
	}

	function* persistAction(action) {
		console.log(action.type, action.fromReduxDistributedInitialLoad);

		if (
			!action.fromReduxDistributedInitialLoad &&
			action.type !== PERSIST &&
			action.type !== REHYDRATE &&
			!action.type.includes("REDUX_DISTRIBUTE")
		) {
			yield call(writeAction, action);
		}
	}

	function* rootSaga() {
		yield takeEvery(REHYDRATE, initalise);

		yield takeEvery("*", persistAction);
	}

	return rootSaga;
};

export default createSaga;
