// @flow
import * as R from "ramda";

type Priority = {
	[string]: "H" | "M" | "L",
}

type SetPriorityAction = {
	type: "SET_PRIORITY",
	objId: string,
	prioirty: Priority,
}

type ClearPriorityAction = {
	type: "CLEAR_PRIORITY",
	objId: string
}

type Actions = SetPriorityAction | ClearPriorityAction

const prioirty = (state: Priority = {}, action: Actions): Priority => {
	switch(action.type){
		case "SET_PRIORITY":
			(action: SetPriorityAction)
			return {
				...state,
				[action.objId]: action.prioirty,
			}

		case "CLEAR_PRIORITY":
			(action: ClearPriorityAction)
			return R.dissoc(action.objId, state)

		default:
			(action: empty)
			return state;
	}
}

export default prioirty
