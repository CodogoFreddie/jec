import generateUUID from "uuid/v4";
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

	return R.reverse(acc);
};

export const createInsertStateAction = ({ obj, state, }) => {
	const mutations = mutationifyObject(state).map(
		R.over(
			R.lensProp("type"),
			type => (type === "obj" && "assoc") || (type === "arr" && "add"),
		),
	);
	const action = {
		meta: {
			time: new Date().getTime(),
			obj,
			action: generateUUID(),
		},
		mutations,
	};
	return action;
};

export const createRemoveStateAction = ({ obj, state, }) => {
	const mutations = mutationifyObject(state)
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

	const action = {
		meta: {
			time: new Date().getTime(),
			obj,
			action: generateUUID(),
		},
		mutations,
	};

	return Action;
};
