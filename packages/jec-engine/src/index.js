import genUUID from "uuid/v4";
import * as R from "ramda";

import {
	insertAction as insertActionToChain,
	insertActions as insertActionsToChain,
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
		.then(insertActionsToChain);

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
				path: [...path, key,],
				value,
			});
		});
	};

	recursiveDecent([], obj);

	return acc;
};

export const insertAction = action => {
	insertActionToChain(action);
	return writeActionHandler(action);
};

export const insertActions = actions => {
	insertActionsToChain(actions);
	return Promise.all(actions.map( action => 
		writeActionHandler(action)
	));
};

