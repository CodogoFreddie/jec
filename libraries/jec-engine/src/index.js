import genUUID from "uuid/v4";
import * as R from "ramda";

import { insertAction, insertActions,
	getState as getFullState,
	getConfig as getFullConfig,
} from "./chain";

let listActionsHandler = () => {};
let readActionHandler = () => {};
let writeActionHandler = () => {};

export const setPersistHandlers = ({
	listActions,
	readAction,
	writeAction,
}) => {
	listActionsHandler = listActions;
	readActionHandler = R.memoizeWith(R.identity, readAction);
	writeActionHandler = writeAction;
};

export const initalise = () =>
	listActionsHandler()
		.then(actions => Promise.all(actions.map(readActionHandler)))
		.then(R.sortBy(R.path(["meta", "timestamp",])))
		.then(insertActions);

export const getState = () => getFullState();
export const getConfig = () => getFullConfig();

const actionifyObject = obj => {
	const acc = [];

	const recursiveDecent = (path, obj) => {
		R.toPairs(obj).forEach(([key, value,]) => {
			if (value instanceof Array) {
				return value.forEach(elem =>
					acc.push({
						type: "arr",
						path: [...path, key,],
						value: elem,
					}),
				);
			}
			if (typeof value === "object") {
				return recursiveDecent([...path, key,], value);
			}

			acc.push({
				type: "obj",
				path: [ ...path, key, ],
				value,
			});
		});
	};

	recursiveDecent([], obj);

	return acc;
};

const applyAction = action => {
	insertAction(action);
	return writeActionHandler(action);
};

export const insertState = ({ obj, state, }) => {
	const mutations = actionifyObject(state).map(
		R.over(
			R.lensProp("type"),
			type => (type === "obj" && "assoc") || (type === "arr" && "add"),
		),
	);
	const action: JecAction = {
		meta: {
			time: new Date().getTime(),
			obj,
			action: genUUID(),
		},
		mutations,
	};

	return applyAction(action);
};

export const removeState = ({ obj, state, }) => {
	const mutations = actionifyObject(state)
		.map(
			R.over(
				R.lensProp("type"),
				type =>
					(type === "obj" && "assoc") || (type === "arr" && "remove"),
			),
		)
		.map(({ type, value, ...rest }) => ({
			...rest,
			type,
			value: type === "assoc" ? null : value,
		}));

	const action: JecAction = {
		meta: {
			time: new Date().getTime(),
			obj,
			action: genUUID(),
		},
		mutations,
	};

	return applyAction(action);
};
