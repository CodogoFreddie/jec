import * as R from "ramda";
import generateUUID from "uuid/v4";
import produceUUID from "uuid/v3";
import {
	hashToUUID,
	mutationifyObject,
	reifyFunction,
	realiseFunction,
	createInsertStateAction,
} from "jec-action-helpers";
import startPure from "jec-pure-cli";

const packageJSON = require("../package.json");

const createConfigIfNeeded = opperators => {
	const config = opperators.getConfig();
	if (!config || !config.jask) {
		console.log("no jask config detected! generating new config");
		return opperators
			.insertAction(createInsertStateAction({
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
			}))
			.then(() => opperators);
	} else {
		return opperators;
	}
};

startPure(console.log)
	.then(createConfigIfNeeded)
	.then( ({ getState, getConfig, insertActions, }) => {
		const newUUID = generateUUID();

		const actions = [
			createInsertStateAction({
				obj: newUUID,
				state: {
					description: "a thing to do",
					due: "2018-02-01T10:17:00.165Z",
					recur: {
						op: "addDays",
						n: 1,
					},
				}
			}),
			R.over(
				R.lensPath([ "meta" ,"time", ]),
				R.inc,
				createInsertStateAction({
					obj: newUUID,
					state: {
						done: "2018-02-01T11:17:00.165Z",
					}
				})
			),
		];

		//return insertActions(actions)
		//.then( () => {

		console.log("\n\nThis is the state:");
		console.log(getState());

		//});
	})
	.catch(console.error);

////const input = {
////action: {
////meta: {
////time: 123,
////action: "actionid",
////obj: "objid",
////},
////mutations: [
////{
////type: "assoc",
////path: [ "done", ],
////value: 123,
////}
////],
////},
////before: {
////description: "this is the description",
////tags: [
////"tag1", "tag2",
////],
////},
////after: {
////description: "this is the description",
////done: 123,
////tags: [
////"tag1", "tag2",
////],
////},
////};
