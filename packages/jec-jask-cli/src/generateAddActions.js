import * as R from "ramda";
import uuid from "uuid/v4";

import parseDateTime, { parseRecur, } from "./parseDateTime";

const parseTimeShortcutValues = [
	R.pipe(R.prop("prop"), R.contains(R.__, [ "due", "wait", "stop", "start", ])),
	R.pipe(
		R.over(R.lensProp("value"), parseDateTime),
		R.over(R.lensProp("type"), R.defaultTo("SET_PROP")),
	),
];

const parseRecurShortcutValues = [
	R.propEq("prop", "recur"),
	R.pipe(
		R.over(R.lensProp("value"), parseRecur),
		R.over(R.lensProp("type"), R.defaultTo("SET_PROP")),
	),
];

const generateProjectActions = ({ projects, }) => [
	R.propEq("prop", "project"),
	R.pipe(R.over(R.lensProp("value"), R.split(".")), ({ value, ...rest }) => {
		const keyValuePairs = R.toPairs(projects);

		const actions = [];
		let prevSubProjectId = undefined;
		for (const subProjectName of value) {
			const [
				existantProjectId,
				{
					name: existantProjectName,
					parent: existantProjectParent,
				} = {},
			] =
				R.find(
					([ id, { name, parent, }, ]) =>
						name === subProjectName && parent === prevSubProjectId,
					keyValuePairs,
				) || [];

			if (existantProjectId) {
				prevSubProjectId = existantProjectId;
				continue;
			} else {
				const projectId = uuid();
				actions.push({
					type: "SET_PROJECT",
					name: subProjectName,
					parent: prevSubProjectId,
					projectId,
				});
				prevSubProjectId = projectId;
				continue;
			}
		}

		actions.push({
			type: "SET_PROP",
			prop: "project",
			value: prevSubProjectId,
		});

		return actions;
	}),
];

const handlePropValueModification = state =>
	R.pipe(
		R.cond([
			parseTimeShortcutValues,
			parseRecurShortcutValues,
			generateProjectActions(state),
			[ R.T, R.over(R.lensProp("type"), R.defaultTo("SET_PROP")), ],
		]),
	);

const handlePlusTagModification = ({ plusTag, }) => ({
	type: "ADD_TAG_TO_OBJ",
	tag: plusTag,
});

const generateAddActions = ({ state, filter, modifications, }) => {
	const objId = uuid();

	const generateActions = R.pipe(
		R.map(
			R.pipe(
				R.cond([
					[
						R.both(R.prop("prop"), R.prop("value")),
						handlePropValueModification(state),
					],
					[ R.prop("plusTag"), handlePlusTagModification, ],
				]),
			),
		),
		R.flatten,
		R.filter(Boolean),
		R.map(R.assoc("objId", objId)),
	);

	return {
		actions: generateActions(modifications),
		filterForRender: () => {},
	};
};

export default generateAddActions;
