import * as R from "ramda";

import toDate from "date-fns/fp/toDate";
import addDays from "date-fns/fp/addDays";
import addWeeks from "date-fns/fp/addWeeks";
import addMonths from "date-fns/fp/addMonths";
import addYears from "date-fns/fp/addYears";

const createRecurenceActionsMiddleware = store => next => action => {
	if (action.fromReduxDistributedInitialLoad) {
		next(action);
		return;
	}

	if (
		action.type === "SET_PROP" &&
		action.prop === "done" &&
		store.getState().props[action.objId].recur
	) {
		const { recur } = store.getState().props[action.objId];

		const incrementer = R.pipe(
			toDate,
			{
				d: addDays,
				w: addWeeks,
				m: addMonths,
				y: addYears,
			}[recur.period](recur.n),
		);

		for (const prop of ["wait", "due", "start", "stop"]) {
			if (store.getState().props[action.objId][prop]) {
				store.dispatch({
					objId: action.objId,
					prop,
					type: "SET_PROP",
					value: incrementer(
						store.getState().props[action.objId][prop],
					),
				});
			}
		}
	} else {
		next(action);
	}
};

export default createRecurenceActionsMiddleware;
