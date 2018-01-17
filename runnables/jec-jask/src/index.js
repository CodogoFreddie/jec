import * as R from "ramda";
import genUUID from "uuid/v4";
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
			hashToUUID
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
