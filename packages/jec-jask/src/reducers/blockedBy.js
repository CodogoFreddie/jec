// @flow
import * as R from "ramda";

import type { BlockedBy, ID, } from "../storeType";

type SetBlockedByAction = {
	type: "SET_BLOCKED_BY",
	id: ID,
	blockedBy: ID
}

type ClearBlockedByAction = {
	type: "CLEAR_BLOCKED_BY",
	id: ID,
}

type Actions = SetBlockedByAction | ClearBlockedByAction

const blockedBy = (state: BlockedBy, action: Actions): BlockedBy => (
	(
		action.type === "SET_BLOCKED_BY"
		? R.assoc(
			action.id,
			action.blockedBy
		)
		: R.dissoc(action.id)
	)(state)
)

export default blockedBy
