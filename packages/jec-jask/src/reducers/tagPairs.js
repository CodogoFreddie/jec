// @flow
import * as R from "ramda";

type TagPair = {
	objId: string,
	tag: string,
}

type TagPairs = Array<TagPair>

export type AddTagPairAction = {
	type: "ADD_TAG_TO_OBJ",
	objId: string,
	tag: string,
}

export type RemoveTagPairAction = {
	type: "REMOVE_TAG_FROM_OBJ",
	objId: string,
	tag: string,
}

type Action = AddTagPairAction | RemoveTagPairAction

const tagPairs = (state: TagPairs = [], action: Action) : TagPairs => {
	switch(action.type){
		case "ADD_TAG_TO_OBJ":
			(action: AddTagPairAction)
			return [
				...state,
				{
					objId: action.objId,
					tag: action.tag,
				},
			]

		case "REMOVE_TAG_FROM_OBJ":
			(action: RemoveTagPairAction)
			return state.filter( R.eqBy( ({ objId, tag, }) => objId + tag )
			)

		default:
			(action: empty)
			return state
	}
}

export default tagPairs
