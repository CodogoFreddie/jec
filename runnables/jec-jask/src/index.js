import * as R from "ramda";
import generateUUID from "uuid/v4";
import produceUUID from "uuid/v3";

import startPure from "jec-pure-cli";

const createConfigIfNeeded = opperators => {
	const config = opperators.getConfig();
	if (!config || !config.jask) {
		console.log("no jask config detected! generating new config");
		return opperators
			.insertState({
				obj: "config",
				state: {
					jask: {
						headers: [
							"score",
							"id",
							"description",
							"due",
							"tags",
							"priority",
							"project",
							"depends",
							"recur",
						],
					},
				},
			})
			.then(() => opperators);
	} else {
		return opperators;
	}
};

//startPure(console.log)
	//.then(createConfigIfNeeded)
	//.then(({ getState, getConfig, }) => {
		//console.log(getState());
		//console.log(getConfig());
//});

const hashToUUID = x => produceUUID(x, "1b671a64-40d5-491e-99b0-da01ff1f3341");


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

const input = { 
	action: {
		meta: {
			time: 123,
			action: "actionid",
			obj: "objid",
		},
		mutations: [
			{
				type: "assoc",
				path: [ "done", ],
				value: 123,
			}
		],
	},
	obj: {
		uuid: "objid",
		description: "this is the description",
		tags: [
			"tag1", "tag2",
		],
	},
};

const derivedActions = R.when(
	R.path([ "obj", "description", ]),
	R.pipe(
		R.over(
			R.lens(
				R.path(["obj", "uuid",]),
				R.assocPath([ "newAction", "meta", "obj", ]),
			),
//need to make sure that we always hash the UUID of the old object, and nothing else!!! that's the only property old the old object that can't change from under us!!!
			hashToUUID
		),

		R.over(
			R.lens(
				R.path(["action", "meta", "time",]),
				R.assocPath([ "newAction", "meta", "time", ]),
			),
			R.inc,
		),

		R.over(
			R.lens(
				R.always(null),
				R.assocPath([ "newAction", "meta", "action", ]),
			),
			generateUUID
		),

		R.over(
			R.lens(
				R.path([ "obj" , ]),
				R.assocPath([ "newAction", "mutations", ]),
			),
			R.pipe(
				actionifyObject,
				R.reject(R.pathEq( ["path", 0,], "uuid" )),

				R.map(R.over(
					R.lensProp("type"),
					R.cond([
						[
							R.equals("obj"),
							R.always("assoc"),
						],
						[
							R.equals("arr"),
							R.always("add"),
						],
					]),
				)),
			)
		),

		R.prop("newAction"),
	),
)(input);

console.log(
	JSON.stringify(
		{
			input,
			derivedActions,
		},
		null,
		2
	)
);
