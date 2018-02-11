import * as R from "ramda";
import df from "date-fns/fp";
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
import parseArgsList from "./parseArgsList";
import filterJec from "./filterJec";
import createMutationFromModify from "./createMutationFromModify";

const [_, __, ...args] = process.argv;

startPure(console.log)
	.then(createConfigIfNeeded)
	.then( ({ getState, getStateArr, getConfig, insertAction, insertActions, }) => {
		const newUUID = generateUUID();

		//insertAction(
			//createInsertStateAction({
				//obj: "c7dddb78-58d4-4a6d-9872-87a6b2334afb",
				//state: {
					//tags: [
						//"bad",
					//]
				//}
			//})
		//);

		const { filter, keyword, modify, } = parseArgsList(args);

		const filteringFunction = filterJec(filter);

		const filteredUUIDs = filteringFunction(getStateArr());

		const mutation = createMutationFromModify(modify);

		console.log(modify, mutation);

		const renderer = render(getConfig());
		console.log(renderer( getStateArr().filter(
			({ uuid, }) => filteredUUIDs.includes(uuid)
		)));

	})
	.catch(console.error);
