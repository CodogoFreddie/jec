import * as R from "ramda";

import giveScore from "./giveScore";

const recursiveGetProject = projects => {
	const rec = projectId => {
		if (projectId) {
			const parent = rec(projects[projectId].parent);
			if (parent) {
				return parent + "." + projects[projectId].name;
			} else {
				return projects[projectId].name;
			}
		} else {
			return "";
		}
	};

	return rec;
};

export const collateObject = state => uuid => ({
	...state.props[uuid],

	tags: state.tagPairs.filter(R.propEq("objId", uuid)).map(R.prop("tag")),

	project: recursiveGetProject(state.projects)(state.props[uuid].project),
});

export const collateAllObjects = state => {
	const collateObjectFn = collateObject(state);

	return state.objs
		.map((uuid, id) => ({
			uuid,
			id: id + 1,
			...collateObjectFn(uuid),
		}))
		.filter(
			({ wait, done, }) =>
				!(done || (wait && new Date().toISOString() > wait)),
		)
		.map(({ start, stop, ...rest }) => ({
			...rest,
			...(!start || (start && stop && stop > start)
				? null
				: {
					start,
				  }),
		}))
		.map(todo => ({
			...todo,
			score: giveScore(todo),
		}));
};
