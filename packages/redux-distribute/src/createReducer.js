import * as R from "ramda";
import { combineReducers, } from "redux";

const sort = R.sortBy(R.identity);

const createReduer = ({
	listenToActions,
}) => ({
	actions: (state = [], { type, timestamp, salt, }) => {

		if(
			(!listenToActions || listenToActions.includes(type))
			&&
			(type && timestamp && salt)
		){
			return R.sortBy(R.identity, [
				...state,
				`${timestamp}_${type}_${salt}`,
			]);
		} else {
			return state;
		}
	}
});

export default createReduer;
