import createJecJaskStore, { collateAllObjects } from "jec-jask";
import * as R from "ramda";

import parseCli from "./parseCli";
import generateAddActions from "./generateAddActions";
import generateModifyActions from "./generateModifyActions";
import generateWorkflowEventActions from "./generateWorkflowEventActions";
import filterByCLICommands from "./filterByCLICommands";
import render from "./render";

import * as distributeHooks from "./distributeHooks";

process.on("unhandledRejection", r => console.log(r));

const store = createJecJaskStore({
	...distributeHooks,
});

store.subscribe(() => {
	const { distrubuteStatus } = store.getState();

	if (distrubuteStatus === "UP_TO_DATE") {
		//console.log(JSON.stringify(store.getState(), null, 2));
	}
});

//let hasRunCliCommand = false;
//store.subscribe(() => {
//if (!hasRunCliCommand) {
//const { __distributeStatus } = store.getState();

//if (__distributeStatus === "READY") {
//hasRunCliCommand = true;

//const { filter, command, modifications } = parseCli(process.argv);

//const noop = () => ({
//actions: [],
//filterForRender: filterByCLICommands(filter),
//});

//const actionGenerator =
//{
//add: generateAddActions,
//modify: generateModifyActions,
//start: generateWorkflowEventActions("start"),
//stop: generateWorkflowEventActions("stop"),
//done: generateWorkflowEventActions("done"),
//}[command] || noop;

//const { actions, filterForRender } = actionGenerator({
//filter,
//modifications,
//state: store.getState(),
//});

//actions.forEach(store.dispatch);

//console.log(
//render(
//{
//filterTask: R.identity,
//giveColor: () => [],
//headers: [
//"id",
//"score",
//"description",
//"due",
//"project",
//"start",
//"priority",
//"tags",
//"recur",
//],
//},
//collateAllObjects(store.getState()).filter(filterForRender),
//),
//);
//}
//}
//});
