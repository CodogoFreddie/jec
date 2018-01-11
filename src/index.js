// @flow
import * as R from "ramda";

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

type JecChainLink = {
	state: GeneticObjectElement,
	lookup: GeneticObjectElement,
	action?: JecAction,
};

type JecChain = Array<JecChainLink>;
let chain: JecChain = [
	{
		state: {},
		lookup: {},
	},
];

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

const earlyAction: JecAction = {
	meta: {
		time: 1415677760,
		action: "ba3ab7a5-e33f-4537-85a7-66d3fff04527",
		obj: "69581654-e60c-46cd-9f47-f29be6d81917",
	},
	mutations: [
		{
			type: "assoc",
			path: ["description",],
			value: "this is one description",
		},
		{
			type: "assoc",
			path: ["tags", "test",],
			value: true,
		},
		{
			type: "assoc",
			path: ["tags", "personal",],
			value: true,
		},
	],
};

const testAction: JecAction = {
	meta: {
		time: 1515677760,
		action: "33a3bd64-0edd-4c45-af05-99987fcb1c02",
		obj: "ff734a42-ebf9-4f57-8bf9-549b8db7e7ee",
	},
	mutations: [
		{
			type: "assoc",
			path: ["description",],
			value: "need to buy more ham",
		},
		{
			type: "assoc",
			path: ["tags", "money",],
			value: true,
		},
		{
			type: "assoc",
			path: ["tags", "personal",],
			value: true,
		},
	],
};

const clearAction: JecAction = {
	meta: {
		time: 1615677760,
		action: "33a3bd64-0edd-4c45-af05-99987fcb1c02",
		obj: "ff734a42-ebf9-4f57-8bf9-549b8db7e7ee",
	},
	mutations: [
		{
			type: "dissoc",
			path: ["description",],
			value: "need to buy more ham",
		},
		{
			type: "dissoc",
			path: ["tags", "money",],
			value: true,
		},
	],
};

insertAction(testAction);
insertAction(earlyAction);
insertAction(clearAction);

console.log(JSON.stringify(chain, null, 2));
