import generateUUID from "uuid/v4";
import startPure from "jec-pure-cli";

import { createInsertStateAction, } from "jec-action-helpers";

import createConfigIfNeeded from "./createConfigIfNeeded";
import render from "./render";
import parseArgsList from "./parseArgsList";
import filterJec from "./filterJec";
import createMutationFromModify from "./createMutationFromModify";

const [_, __, ...args] = process.argv;

startPure(console.log)
	.then(createConfigIfNeeded)
	.then(
		({ getState, getStateArr, getConfig, insertAction, insertActions, }) => {
			const { filter, keyword, modifiers, filterPresent, } = parseArgsList(
				args,
			);

			//const filteredUUIDs = filteringFunction(getStateArr());

			console.log(keyword);

			const filteringFunction = filterJec(filter);
			const filteredUUIDs = filteringFunction(getStateArr());
			const renderer = render(getConfig());

			if (keyword === "add") {
				const newTaskUUID = generateUUID();

				insertAction({
					meta: {
						time: new Date().getTime(),
						obj: newTaskUUID,
						action: generateUUID(),
					},
					mutations: createMutationFromModify(modifiers),
				});

				return console.log(
					renderer([
						{
							uuid: newTaskUUID,
							...getState()[newTaskUUID],
						},
					]),
				);
			}

			//the following actions modify jec.
			//therefore we need to be filtering which objects we're going to modify
			if (filterPresent) {
				if (keyword === "modify") {
					const mutations = createMutationFromModify(modifiers);

					const actions = filteredUUIDs.map(obj => ({
						meta: {
							time: new Date().getTime(),
							obj,
							action: generateUUID(),
						},
						mutations,
					}));

					insertActions(actions);
				}

				//these keywords simply put the current date into their respective props
				const simpleTimeSettingKeywords = ["done", "start", "stop",];
				if (simpleTimeSettingKeywords.includes(keyword)) {
					const actions = filteredUUIDs.map(obj =>
						createInsertStateAction({
							obj,
							state: {
								[keyword]: new Date().toISOString(),
							},
						}),
					);

					insertActions(actions);
				}
			}

			console.log(
				renderer(
					getStateArr().filter(({ uuid, }) =>
						filteredUUIDs.includes(uuid),
					),
				),
			);
		},
	)
	.catch(console.error);
