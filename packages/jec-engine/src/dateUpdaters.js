import * as R from "ramda";
import df from "date-fns/fp";
import { mutationifyObject, } from "jec-action-helpers";

const testRecur = test => R.pipe(
	R.prop("op"),
	R.test(test),
);

const addUnit = ({ op, n, }) => df[op](n);

const startOfUnit = ({ op, }) => R.pipe(
	df[op.replace("startOf", "endOf")],
	df.addMilliseconds(1),
	df[op],
);

const endOfUnit = ({ op, }) => R.pipe(
	df[op],
	df.addMilliseconds(1),
	df[op],
);

export const generateRecurrenceFunction = R.cond([
	[
		testRecur(/^add/),
		addUnit,
	],
	[
		testRecur(/^startOf/),
		startOfUnit,
	],
	[
		testRecur(/^endOf/),
		endOfUnit,
	],
]);

export const generateRecurrenceMutations = ({ state, action }) => {
	const { recur, due, wait, } = state[action.meta.obj];

	const recurrenceFunction = generateRecurrenceFunction(recur);

	return R.pipe(
		R.filter(Boolean),
		R.map( recurrenceFunction ),
		R.map( x => x.toISOString() ),
		mutationifyObject,
		R.map(
			R.over(
				R.lensProp("type"),
				type => (type === "obj" && "assoc") || (type === "arr" && "add"),
			),
		),
	)({
		due,
		wait,
	});
};

export const shouldGenerateRecurrenceFunction = R.pipe(
	R.path([ "action", "mutations", ]),
	R.any(
		R.propEq("path", [ "done", ]),
	),
);
