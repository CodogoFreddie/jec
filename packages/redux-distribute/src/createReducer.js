import * as R from "ramda";
import { PERSIST, REHYDRATE } from "redux-persist";
import { combineReducers } from "redux";

const goodActions = R.pipe(
	R.filter(Boolean),
	R.uniqBy(R.identity),
	R.sortBy(R.identity),
);

const createReduer = ({ listenToActions }) => ({
	__distributeStatus: (state = "STARTING", { type }) => {
		switch (type) {
			case REHYDRATE:
				return "HYDRATED";

			case "REDUX_DISTRIBUTE/DONE_INITIAL_LOAD":
				return "READY";

			default:
				return state;
		}
	},

	__distributeActions: (state = [], { type, timestamp, salt }) => {
		if (
			(!listenToActions || listenToActions.includes(type)) &&
			(type && timestamp && salt) &&
			type !== PERSIST &&
			type !== REHYDRATE &&
			!type.includes("REDUX_DISTRIBUTE")
		) {
			return goodActions([...state, `${timestamp}_${type}_${salt}`]);
		} else {
			return state;
		}
	},
});

export default createReduer;
