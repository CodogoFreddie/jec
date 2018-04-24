import * as R from "ramda";

const SET_PROJECT = (state, { projectId, name, parent }) =>
	R.over(
		R.lensProp(projectId),
		R.merge({
			name,
			parent,
		}),
		state,
	);

const projects = (state = {}, action) =>
	(({
		SET_PROJECT,
	}[action.type] || R.identity)(state, action));

export default projects;
