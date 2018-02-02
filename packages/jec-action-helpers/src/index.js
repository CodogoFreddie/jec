import produceUUID from "uuid/v3";
import * as R from "ramda";

export const hashToUUID = x =>
	produceUUID(x, "1b671a64-40d5-491e-99b0-da01ff1f3341");

export const mutationifyObject = obj => {
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

	console.log( acc);
	return acc;
};

export const callArray = ([...x]) => (
	console.log("in", x),
	console.log("out", R.call(...x)),
	R.call(...x)
);

export const reifyFunction = new Proxy(
	{},
	{
		get: (target, op) => (...args) => ({
			op,
			args,
		}),
	},
);

export const reifyUncalledFunction = new Proxy(
	{},
	{
		get: (target, op) => ({
			op,
		}),
	},
);

export const realiseFunction = functionSources => {
	const functionSource = functionSources.reduce(R.merge, {});

	const recursiveRealiser = node => {
		if (node.op) {
			return node.args
				? functionSource[node.op](
					...(node.args || []).map(recursiveRealiser),
				)
				: functionSource[node.op];
		} else if(Array.isArray(node)){
			return node.map(recursiveRealiser);
		} else {
			return node;
		}
	};

	return recursiveRealiser;
};
