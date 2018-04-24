import * as R from "ramda";

import { toDate, addDays, addWeeks, addMonths, addYears } from "date-fns/fp";

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

		for (const prop of [ "wait", "due", "start", "stop"]) {
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
