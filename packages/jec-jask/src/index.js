import * as R from "ramda";
import generateUUID from "uuid/v4";
import produceUUID from "uuid/v3";
import startPure from "jec-pure-cli";

import {
	hashToUUID,
	mutationifyObject,
	createInsertStateAction,
} from "jec-action-helpers";

import createConfigIfNeeded from "./createConfigIfNeeded";
import render from "./render";

const packageJSON = require("../package.json");

const [_, __, ...args] = process.argv;

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

		console.log(render(getConfig())(getState()));

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
