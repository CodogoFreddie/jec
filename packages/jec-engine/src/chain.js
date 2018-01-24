// @flow
import * as R from "ramda";

type JecType = "String" | "Number" | "DateTime" | "Boolean" | "Link";
type RecursiveJecType = {
	[string]: JecType | Array<RecursiveJecType> | RecursiveJecType,
};

type Mutation = {
	type: "assoc" | "add" | "remove",
	path: Array<string>,
	value: string | number | boolean | JecType,
};

type JecAction = {
	meta: {
		time: number,
		action: string,
		obj: string,
	},
	mutations: Array<Mutation>,
};

type JecState = {
	action?: JecAction,
	state?: any,
};

type JecStateChain = Array<JecState>;

//the state singleton, contains a history of all previous states
let stateChain: JecStateChain = [{ state: {}, },];

//reducer for applying actions
const applyAction = (state: any, action: JecAction): any => {
	const mutationFunctions = action.mutations.map(({ type, path, value, }) =>
		R.over(
			R.lensPath([action.meta.obj, ...path,]),
			(type === "assoc" && (() => value)) ||
				(type === "add" && R.pipe(R.defaultTo([]), R.union([value,]))) ||
				(type === "remove" &&
					R.pipe(R.defaultTo([]), R.difference(R.__, [value,]))),
		),
	);

	return mutationFunctions.reduce((state, fn) => fn(state), state);
};

//inserts an aciton into the chain, and rebuilds the current state
export const insertAction = (action: JecAction) => {
	const insertIndex = R.findIndex(
		R.pipe(
			R.path(["action", "meta", "time",]),
			R.defaultTo(0),
			R.lt(action.meta.time),
		),
		stateChain,
	);

	console.log("this is an action", action);

	stateChain = R.insert(
		insertIndex,
		{
			action,
		},
		stateChain,
	);

	stateChain = R.scan(
		({ state: previousState, }, { action: currentAction, }) => {
			return {
				action: currentAction,
				state: applyAction(previousState, currentAction),
			};
		},
		R.head(stateChain),
		R.tail(stateChain),
	);
};

//insert many actions
export const insertActions = (actions: Array<JecAction>) => {
	R.sortBy(R.path(["meta", "time",]), actions).forEach(insertAction);
};

//get the head state in a usable way
const map = R.addIndex(R.map);
export const getState = (): JecState =>
	R.pipe(
		R.last,
		R.prop("state"),
		R.omit(["config",]),
		R.toPairs,
		R.sortBy(R.nth(0)),
		map(([uuid, rest,], id) => [
			uuid,
			{
				...rest,
				id,
			},
		]),
		R.fromPairs,
	)(stateChain);

export const getConfig = (): any =>
	R.pipe(R.last, R.path(["state", "config",]))(stateChain);
