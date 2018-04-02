import * as R from "ramda";

const descriptions = (state = {}, action) => {
	switch (action.type) {
	case "SET_DESCRIPTION":
		return {
			...state,
			[action.objId]: action.description,
		};

	case "CLEAR_DESCRIPTION":
		return R.dissoc(action.objId, state);

	default:
		return state;
	}
};

export default descriptions;
