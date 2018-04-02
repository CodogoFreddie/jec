import * as R from "ramda";

const prioirty = (state= {}, action) => {
	switch(action.type){
		case "SET_PRIORITY":
			return {
				...state,
				[action.objId]: action.prioirty,
			}

		case "CLEAR_PRIORITY":
			return R.dissoc(action.objId, state)

		default:
			return state;
	}
}

export default prioirty
