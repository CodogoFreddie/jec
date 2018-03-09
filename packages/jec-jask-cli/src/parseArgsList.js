import * as R from "ramda";

const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
const keyworkRegex = /(add|modify|delete|done|start|stop)/;

export default args => {
	const [filter, [keyword, ...modifiers],] = R.splitWhen(
		R.test(keyworkRegex),
		args.filter(R.length),
	);

	const filterPresent = !!filter.length;
	const modifiersPresent = !!modifiers.length;

	const groupArgs = R.pipe(
		R.groupBy(
			x =>
				(R.test(/^[0-9]+$/, x) && "ids") ||
				(R.test(uuidRegex, x) && "uuids") ||
				(R.test(/^[a-zA-Z0-9]+:.+$/, x) && "props") ||
				(R.test(/^[+-][a-zA-Z0-9]+$/, x) && "tags") ||
				"description",
		),

		R.over(R.lensProp("ids"), R.defaultTo([])),
		R.over(R.lensProp("uuids"), R.defaultTo([])),
		R.over(R.lensProp("props"), R.defaultTo([])),
		R.over(R.lensProp("tags"), R.defaultTo([])),

		R.over(R.lensProp("description"), R.defaultTo([])),
		R.over(R.lensProp("description"), R.join(" ")),

		R.over(R.lensProp("props"), R.pipe(R.map(R.split(":")), R.fromPairs)),
	);

	return R.pipe(
		R.evolve({
			filter: groupArgs,
			modifiers: groupArgs,
		}),
	)({
		filter,
		keyword,
		modifiers,
		filterPresent,
		modifiersPresent,
	});
};
