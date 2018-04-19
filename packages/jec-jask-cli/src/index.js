import createJecJaskStore, { collateAllObjects, } from "jec-jask";
import * as R from "ramda";

import parseCli from "./parseCli";
import generateAddActions from "./generateAddActions";
import generateModifyActions from "./generateModifyActions";
import generateWorkflowEventActions from "./generateWorkflowEventActions";
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

			const noop = () => ({
				actions: [],
				filterForRender: filterByCLICommands(filter),
			});

			const actionGenerator =
				{
					add: generateAddActions,
					modify: generateModifyActions,
					start: generateWorkflowEventActions("start"),
					stop: generateWorkflowEventActions("stop"),
					done: generateWorkflowEventActions("done"),
				}[command] || noop;

			const { actions, filterForRender, } = actionGenerator({
				filter,
				modifications,
				state: store.getState(),
			});

			actions.forEach(store.dispatch);
			actions.forEach(console.log);

			console.log(
				render(
					{
						filterTask: R.identity,
						giveScore: R.pipe(R.prop("id"), R.subtract(0)),
						giveColor: () => [],
						headers: [
							"id",
							"description",
							"tags",
							"project",
							"due",
							"wait",
							"start",
							"stop",
							"done",
						],
					},
					collateAllObjects(store.getState()).filter(filterForRender),
				),
			);
		}
	}
});
