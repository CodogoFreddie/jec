import createJecJaskStore, { collateAllObjects, } from "jec-jask";
import * as R from "ramda";

import parseCli from "./parseCli";
import generateAddActions from "./generateAddActions";
import generateModifyActions from "./generateModifyActions";
import filterByCLICommands from "./filterByCLICommands";
import render from "./render";
import { 
	listAllActions,
	writeAction,
	readAction,
	persistStorage,
} from "./distributeHooks";

process.on("unhandledRejection", r => console.log(r));

const store = createJecJaskStore({
	listAllActions,
	writeAction,
	readAction,
	persistStorage,
});

let hasRunCliCommand = false;
store.subscribe(() => {
	if (!hasRunCliCommand) {
		const { __distributeStatus, } = store.getState();

		if (__distributeStatus === "READY") {
			hasRunCliCommand = true;

			const { filter, command, modifications, } = parseCli(process.argv);

			const noop = () => ({ actions: [], filterForRender: filterByCLICommands(filter), });

			const actionGenerator =
				{
					add: generateAddActions,
					modify: generateModifyActions,
				}[command] || noop;

			const { actions, filterForRender, } = actionGenerator({
				filter,
				modifications,
				state: store.getState(),
			});

			console.log(actions)

			actions.forEach(store.dispatch);

			console.log(
				render(
					{
						filterTask: R.identity,
						giveScore: R.prop("i"),
						giveColor:  () => [],
						headers: [
							"description",
							"tags",
							"project",
							"due",
							"wait",
						],
					},
					collateAllObjects(store.getState()).filter(filterForRender)
				)
			)
		}
	}
});
