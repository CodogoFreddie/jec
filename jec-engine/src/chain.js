// @flow
import * as R from "ramda";

const map = R.addIndex(R.map);

type Mutation = {
	type: "assoc" | "dissoc",
	path: Array<string>,
	value: string | number | boolean,
};

type JecAction = {
	meta: {
		time: number,
		action: string,
		obj: string,
	},
	mutations: Array<Mutation>,
};

type GeneticObjectElement = {
	[string]: string | number | boolean | GeneticObjectElement,
};

type RecusiveTypeDefinition = {
	[string]: "Number" | "String" | "DateTime" | "Boolean" | "Link" | RecusiveTypeDefinition,
};

type JecChainLink = {
	state: GeneticObjectElement,
	lookup: GeneticObjectElement,
	types: RecusiveTypeDefinition,
	action?: JecAction,
};

type JecChain = Array<JecChainLink>;

let chain: JecChain = [
	{
		state: {},
		lookup: {},
		types: {},
	},
];

export const getState = () => R.pipe(
	R.last,
	R.propOr({}, "state"),
	R.toPairs,
	R.map(([uuid, rest,]) => ({
		uuid,
		...rest,
	})),
	R.sortBy(R.prop("uuid")),
	map((rest, id) => ({
		...rest,
		id,
	})),
	R.fromPairs,
)(chain);

export const getLookup = () => R.pipe(
	R.last,
	R.propOr({}, "lookup"),
)(chain);

export const insertAction = (action: JecAction) => {
	const insertIndex = R.findIndex(
		R.pipe(R.path(["action", "meta", "time",]), R.lt(action.meta.time)),
		chain,
	);

	chain = R.insert(
		insertIndex,
		{
			action,
		},
		chain,
	);

	chain = R.scan(
		({ state, lookup, }, { action, }) => {
			return {
				...R.reduce(
					({ state, lookup, }, { type, path, value, }) =>
					R.evolve({
						state:
						type === "assoc"
						? R.assocPath(
							[action.meta.obj, ...path,],
							value,
						)
						: R.dissocPath([action.meta.obj, ...path,]),

						lookup:
						type === "assoc"
						? R.assocPath(
							[...path, action.meta.obj,],
							value,
						)
						: R.dissocPath([...path, action.meta.obj,]),
					})({ state, lookup, }),

					{ state, lookup, },
					action.mutations,
				),
				action,
			};
		},
		R.head(chain),
		R.tail(chain),
	);
};
