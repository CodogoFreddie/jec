// @flow
import * as R from "ramda";

import type { Due, ID, } from "../storeType";

type SetDueAction = {
	type: "SET_DUE_DATE",
	id: ID,
	dueDate: string,
}

type ClearDueAction = {
	type: "CLEAR_DUE_DATE",
	id: ID,
}

type Actions = SetDueAction | ClearDueAction

const due = (state: Due, action: Actions): Due => (
	(
		action.type === "SET_DUE_DATE"
		? R.assoc(
			action.id,
			action.dueDate
		)
		: R.dissoc(action.id)
	)(state)
)


export default due
