import * as R from "ramda";
import uuid from "uuid/v4";

import parseDateTime, { parseRecur, } from "./parseDateTime";

const parseTimeShortcutValues = [
	R.pipe(
		R.prop("prop"),
		R.contains(R.__, ["due", "wait", "stop", "start", ]),
	),
	R.over(
		R.lensProp("value"),
		parseDateTime,
	),
];

const parseRecurShortcutValues = [
	R.propEq("prop", "recur"),
	R.over(
		R.lensProp("value"),
		parseRecur,
	),
];

const generateProjectActions = ({ projects, }) => [

]

const handlePropValueModification = state => R.pipe(
	R.cond([
		parseTimeShortcutValues,
		parseRecurShortcutValues,
		generateProjectActions(state),
		[
			R.T,
			R.identity,
		],
	]),
	R.over(
		R.lensProp("type"),
		R.defaultTo("SET_PROP"),
	),
)

const handlePlusTagModification = ({ plusTag, }) => ({
	type: "ADD_TAG_TO_OBJ",
	tag: plusTag,
})

const generateAddActions = ({ state, filter, modifications, }) => {
	const objId = uuid();

	const generateActions = R.pipe(
		R.map(
			R.pipe(
				R.tap(console.log),
				R.cond([
					[
						R.both(R.prop("prop"),R.prop("value")),
						handlePropValueModification(state),
					],
					[
						R.prop("plusTag"),
						handlePlusTagModification,
					],
				])
			),
		),
		//R.flatten,
		R.filter(Boolean),
		R.map(
			R.assoc("objId", objId),
		),
	);

	return {
		actions: generateActions(modifications),
		filterForRender: () => {},
	}
}

export default generateAddActions;
