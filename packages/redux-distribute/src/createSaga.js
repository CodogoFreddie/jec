import * as R from "ramda";
import { put, select, } from "redux-saga/effects";

const createSaga = ({
	listenToActions,
	listAllActions,
	readAction,
}) => {

	function* introduceActionById(id){
		//is there already an action by this id in the store?

		const ids = yield select( R.prop("actions") );
		const isAlreadyInStore = !!ids.find( id_ => id_ === id );

		if(!isAlreadyInStore){
			const action = yield readAction(id);
			yield put(action);
		}
	}

	function* rootSaga(){
		for( const prom of listAllActions()){
			const id = yield prom;

			yield* introduceActionById(id);
		}

		yield put({
			type: "REDUX_DISTRIBUTE/DONE_INITIAL_LOAD",
		});
	}

	return rootSaga;
}

export default createSaga;
