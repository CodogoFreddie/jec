import generateUUID from "uuid/v4";
import startPure from "jec-pure-cli";

import { createInsertStateAction } from "jec-action-helpers";

import createConfigIfNeeded from "./createConfigIfNeeded";
import render from "./render";
import parseArgsList from "./parseArgsList";
import filterJec from "./filterJec";
import createMutationFromModify from "./createMutationFromModify";

var _process$argv = process.argv,
    _ = _process$argv[0],
    __ = _process$argv[1],
    args = _process$argv.slice(2);

startPure(console.log).then(createConfigIfNeeded).then(function (_ref) {
	var getState = _ref.getState,
	    getStateArr = _ref.getStateArr,
	    getConfig = _ref.getConfig,
	    insertAction = _ref.insertAction,
	    insertActions = _ref.insertActions;

	var _parseArgsList = parseArgsList(args),
	    filter = _parseArgsList.filter,
	    keyword = _parseArgsList.keyword,
	    modifiers = _parseArgsList.modifiers,
	    filterPresent = _parseArgsList.filterPresent;

	//const filteredUUIDs = filteringFunction(getStateArr());

	console.log(keyword);

	var filteringFunction = filterJec(filter);
	var filteredUUIDs = filteringFunction(getStateArr());
	var renderer = render(getConfig());

	if (keyword === "add") {
		var newTaskUUID = generateUUID();

		insertAction({
			meta: {
				time: new Date().getTime(),
				obj: newTaskUUID,
				action: generateUUID()
			},
			mutations: createMutationFromModify(modifiers)
		});

		return console.log(renderer([Object.assign({
			uuid: newTaskUUID
		}, getState()[newTaskUUID])]));
	}

	//the following actions modify jec.
	//therefore we need to be filtering which objects we're going to modify
	if (filterPresent) {
		if (keyword === "modify") {
			var mutations = createMutationFromModify(modifiers);

			var actions = filteredUUIDs.map(function (obj) {
				return {
					meta: {
						time: new Date().getTime(),
						obj: obj,
						action: generateUUID()
					},
					mutations: mutations
				};
			});

			insertActions(actions);
		}

		//these keywords simply put the current date into their respective props
		var simpleTimeSettingKeywords = ["done", "start", "stop"];
		if (simpleTimeSettingKeywords.includes(keyword)) {
			var _actions = filteredUUIDs.map(function (obj) {
				var _state;

				return createInsertStateAction({
					obj: obj,
					state: (_state = {}, _state[keyword] = new Date().toISOString(), _state)
				});
			});

			insertActions(_actions);
		}
	}

	console.log(renderer(getStateArr().filter(function (_ref2) {
		var uuid = _ref2.uuid;
		return filteredUUIDs.includes(uuid);
	})));
}).catch(console.error);