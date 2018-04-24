import * as R from "ramda";

const tagPairs = (state = [], action) => {
	switch (action.type) {
		case "REDUX_DISTRIBUTE/PURGE_ALL_STATE":
			return [];

		case "ADD_TAG_TO_OBJ":
			return [
				...state,
				{
					objId: action.objId,
					tag: action.tag,
				},
			];

		case "REMOVE_TAG_FROM_OBJ":
			return state.filter(R.eqBy(({ objId, tag }) => objId + tag));

		default:
			return state;
	}
};

export default tagPairs;
