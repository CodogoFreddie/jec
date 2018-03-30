// @flow
import * as R from "ramda";

type Descriptions = {
	[string]: string
}

export type SetDescriptionAction = {
	type: "SET_DESCRIPTION",
	objId: string,
	description: string,
}

export type ClearDescriptionAction = {
	type: "CLEAR_DESCRIPTION",
	objId: string,
}

type Actions = SetDescriptionAction | ClearDescriptionAction

const descriptions = (state: Descriptions = {} , action: Actions): Descriptions => {
	switch(action.type){
		case "SET_DESCRIPTION":
			(action: SetDescriptionAction)
			return {
				...state,
				[action.objId]: action.description,
			}

		case "CLEAR_DESCRIPTION":
			(action: ClearDescriptionAction)
			return R.dissoc(action.objId, state)

		default:
			(action: empty)
			return state;
	}
}


export default descriptions
