import * as R from "ramda";
import { collateAllObjects, } from "jec-jask";

import modifyByCLICommand from "./modifyByCLICommands";
import filterByCLICommands from "./filterByCLICommands";

const generateModifyActions = ({ state, filter, modifications, }) => {
	const filterUUIDs = filterByCLICommands(filter);
	const applyToUUIDs = collateAllObjects(state)
		.filter(filterUUIDs)
		.map(R.prop("uuid"));

	const generateActions = R.pipe(
		modifyByCLICommand(state),
		R.map(action =>
			applyToUUIDs.map(objId => ({
				...action,
				objId,
			})),
		),
		R.flatten,
	);

	return {
		actions: generateActions(modifications),
		filterForRender: filterUUIDs,
	};
};

export default generateModifyActions;
