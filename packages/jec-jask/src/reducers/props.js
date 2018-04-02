import * as R from "ramda";

const props = (state, action) => {
	switch(action.type){
		case "SET_PROP":
			return R.assocPath(
				[ action.objId, action.prop, ],
				action.value,
				state
			)
		case "CLEAR_PROP":
			return R.dissocPath(
				[ action.objId, action.prop, ],
				state
			)

		default:
			return state
	}
}

export default props;
