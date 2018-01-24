import * as R from "ramda";
//import generateUUID from "uuid/v4";
import produceUUID from "uuid/v3";
import {
	hashToUUID,
	mutationifyObject,
	reifyFunction,
	realiseFunction,
} from "jec-action-helpers";
import startPure from "jec-pure-cli";

import recurOnDoneMiddleware from "./recurOnDoneMiddleware";
const packageJSON = require("../package.json");

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

const createRecurOnDoneMiddlewareIfNeeded = opperators => {
	const config = opperators.getConfig();

	if (
		R.pathEq(
			["afterware", "done", recurOnDoneMiddleware.uuid, "version",],
			packageJSON.version,
			config,
		)
	) {
		return opperators;
	} else {
		if (R.path(["afterware", "done",], config)) {
			console.log("outdated recurOnDoneMiddleware, updateing");
		} else {
			console.log("no recurOnDoneMiddleware, installing");
		}

		return opperators
			.insertState({
				obj: "config",
				state: {
					afterware: {
						done: {
							[recurOnDoneMiddleware.uuid]: recurOnDoneMiddleware,
						},
					},
				},
			})
			.then(() => opperators);
	}
};

startPure(console.log)
	.then(createConfigIfNeeded)
	.then(createRecurOnDoneMiddlewareIfNeeded)
	.then(({ getState, getConfig, }) => {
		//console.log(getState());
		console.log(getConfig().afterware);
	})
	.catch(console.error);

//const input = {
//action: {
//meta: {
//time: 123,
//action: "actionid",
//obj: "objid",
//},
//mutations: [
//{
//type: "assoc",
//path: [ "done", ],
//value: 123,
//}
//],
//},
//before: {
//description: "this is the description",
//tags: [
//"tag1", "tag2",
//],
//},
//after: {
//description: "this is the description",
//done: 123,
//tags: [
//"tag1", "tag2",
//],
//},
//};
