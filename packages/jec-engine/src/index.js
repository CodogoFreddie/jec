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
export const getStateArr = () =>
	R.pipe(
		R.toPairs,
		R.map(([uuid, rest,]) => ({
			uuid,
			...rest,
		})),
	)(getFullState());

export const getConfig = () => getFullConfig();

export const insertAction = action => {
	insertActionToChain(action);
	return writeActionHandler(action);
};

export const insertActions = actions => {
	insertActionsToChain(actions);
	return Promise.all(actions.map(action => writeActionHandler(action)));
};
