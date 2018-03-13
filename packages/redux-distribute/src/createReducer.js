import * as R from "ramda";
import { combineReducers, } from "redux";

const sort = R.sortBy(R.identity);

const createReduer = ({
	listenToActions,
}) => combineReducers({
	actions: (state = [], { type, timestamp, salt, }) => {
		if(!listenToActions || listenToActions.includes(action.type)){
			return R.sort( [
				...state,
				timestamp + type + salt,
			]);
		} else {
			return state;
		}
	}
});

export default createReduer;
