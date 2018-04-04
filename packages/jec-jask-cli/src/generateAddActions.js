import * as R from "ramda";
import uuid from "uuid/v4";

import modifyByCLICommand from "./modifyByCLICommands";

const generateAddActions = ({ state, filter, modifications, }) => {
	const objId = uuid();

	const generateActions = R.pipe(
		modifyByCLICommand(state),
		R.map(R.assoc("objId", objId)),
	);

	return {
		actions: generateActions(modifications),
		filterForRender: R.T,
	};
};

export default generateAddActions;
