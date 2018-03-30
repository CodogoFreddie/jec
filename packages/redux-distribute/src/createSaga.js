import * as R from "ramda";
import { put, call, takeEvery, fork, } from "redux-saga/effects";

const createSaga = ({
	listenToActions,
	listAllActions,
	readAction,
	writeAction,
}) => {

	const getAllActions = async () => {
		const actionPromises = []
		for await ( const id of listAllActions() ){
			actionPromises.push(
				readAction(id)
			)
		}

		const actions = Promise.all(actionPromises);

		return actions;
	}

	function* initalise(){
		const allActions = yield call(getAllActions)

		for(const action of allActions){
			yield put({
				...action,
				fromReduxDistirubteInitialLoad: true,
			})
		}

		yield put({
			type: "REDUX_DISTRIBUTE/DONE_INITIAL_LOAD",
			fromReduxDistirubteInitialLoad: true,
		});
	}

	function* persistAction(action){
		if(action.fromReduxDistirubteInitialLoad){
			return
		}
			console.log("persistAction", action);
	}

	function* rootSaga(){
		yield fork(initalise);

		yield takeEvery(listAllActions || "*", persistAction);
	}

	return rootSaga;
}

export default createSaga;
