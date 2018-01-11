import * as R from "ramda";

import { insertAction, realiseActions, getState, } from "./chain";
import { parseArgsList, } from "./parseArgsList";
import * as opperations from "./opperations";

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

export const initaliseJask = () =>
	listActionsHandler()
		.then(actions => Promise.all(actions.map(readActionHandler)))
		.then(R.sortBy(R.path(["meta", "timestamp",])))
		.then(realiseActions);

export const runQuery = query => {
	const {
		filter,
		keyword,
		modifiers,
		filterPresent,
		modifiersPresent,
	} = parseArgsList(query.split(" "));

	const {
		opperationFilter,
		opperationActionCreator,
		returnFilter,
	} = (opperations[keyword] || opperations.noop)({
		filter,
		filterPresent,
		modifiers,
		modifiersPresent,
	});

	const newActions = opperationActionCreator(
		getState().filter(opperationFilter),
	);

	newActions.forEach(writeActionHandler);

	newActions.forEach(insertAction);

	return getState().filter(returnFilter);
};

