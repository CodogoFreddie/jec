import * as R from "ramda";
//import generateUUID from "uuid/v4";
import produceUUID from "uuid/v3";
import { hashToUUID, mutationifyObject, reifyFunction, realiseFunction, } from "jec-action-helpers";

import recurOnDoneMiddleware from "./recurOnDoneMiddleware";

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
	before: {
		description: "this is the description",
		tags: [
			"tag1", "tag2",
		],
	},
	after: {
		description: "this is the description",
		done: 123,
		tags: [
			"tag1", "tag2",
		],
	},
};


//console.log(recurOnDoneMiddleware);
console.log(JSON.stringify(mutationifyObject(recurOnDoneMiddleware), null, 2));
