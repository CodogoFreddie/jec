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

let stateChain: JecStateChain = [{ state: {}, },];

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

export const insertAction = (action: JecAction) => {
	const insertIndex = R.findIndex(
		R.pipe(R.path(["action", "meta", "time",]), R.lt(action.meta.time)),
		stateChain,
	);

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
		...R.splitAt(insertIndex, stateChain),
	);
};

export const insertActions = (actions: Array<JecAction>) => {
	R.sortBy(R.path(["meta", "time",]), actions).forEach(insertAction);
};

export const getState = (): JecState => R.last(stateChain).state;
