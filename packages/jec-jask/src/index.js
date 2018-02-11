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

		const { filter, keyword, modifiers, filterPresent, modifiersPresent, } = parseArgsList(args);

		const filteringFunction = filterJec(filter);

		const filteredUUIDs = filteringFunction(getStateArr());

		if(filterPresent, modifiersPresent){
			const mutations = createMutationFromModify(modifiers);

			const actions = filteredUUIDs.map( obj => ({
				meta: {
					time: new Date().getTime(),
					obj,
					action: generateUUID(),
				},
				mutations,
			}));

			insertActions(actions);
		}

		const renderer = render(getConfig());
		console.log(renderer( getStateArr().filter(
			({ uuid, }) => filteredUUIDs.includes(uuid)
		)));

	})
	.catch(console.error);
