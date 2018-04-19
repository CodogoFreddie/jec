import * as R from "ramda";
import { collateAllObjects, } from "jec-jask";

import filterByCLICommands from "./filterByCLICommands";

const generateWorkflowEventActions = eventName => ({ state, filter, modifications, }) => {
	const filterUUIDs = filterByCLICommands(filter);
	const applyToUUIDs = collateAllObjects(state)
		.filter(filterUUIDs)
		.map(R.prop("uuid"))
		.map(R.prop("uuid"));

	const actions = applyToUUIDs.map( objId => ({
		objId,
		prop: eventName,
		type: "SET_PROP",
		value: new Date().toISOString(),
	}))

	return {
		actions,
		filterForRender: filterUUIDs,
	};
};

export default generateWorkflowEventActions;

