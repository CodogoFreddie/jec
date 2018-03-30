// @flow
import * as R from "ramda";

import type { Descriptions, ID, } from "../storeType";

export type SetDescriptionAction = {
	type: "SET_DESCRIPTION",
	id: ID,
	description: string,
}

export type ClearDescriptionAction = {
	type: "CLEAR_DESCRIPTION",
	id: ID,
}

type Actions = SetDescriptionAction | ClearDescriptionAction

const descriptions = (state: Descriptions, action: Actions): Descriptions => (
	(
		action.type === "SET_DESCRIPTION"
		? R.assoc(
			action.id,
			action.description
		)
		: R.dissoc(action.id)
	)(state)
)


export default descriptions
