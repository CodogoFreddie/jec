// @flow
import * as R from "ramda";
import uuid from "uuid/v4";
import type { State, Action, } from "jec-jask"

import type { DataInterfaceTypes, } from "./parseCli";

import parseDateTime from "./parseDateTime";

type GenerateAddActionsType = (State, filteredUUIDs: Array<string>, modifications: Array<DataInterfaceTypes> ) => Array<Action>

const generateAddActions: GenerateAddActionsType = (state, filteredUUIDs, modifications) => {
	const objId = uuid();
	return modifications.map( (modification) => {

		if(modification.plain){
			return({
				type: "SET_DESCRIPTION",
				objId,
				description: modification.plain,
			})
		}

		if(modification.plusTag){
			return ({
				type: "ADD_TAG_TO_OBJ",
				objId,
				tag: modification.plusTag,
			})
		}

		if(modification.priority){
			return ({
				type: "SET_PRIORITY",
				objId,
				prioirty: modification.priority,
			})
		}

		if(modification.due){
			return ({
				type: "SET_DUE_DATE",
				objId,
				due: parseDateTime(modification.due),
			})
		}

		if(modification.wait){
			return ({
				type: "SET_WAIT_DATE",
				objId,
				wait: parseDateTime(modification.wait),
			})
		}

		return false
	}).filter(Boolean)
}

export default generateAddActions;
