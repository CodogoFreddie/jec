import { actions, states } from "./consts";

import { idFromAction } from "./lib";

const {
	DISTRIBUTE_REPLAY_ACTION,
	DISTRIBUTE_UP_TO_DATE,
	DISTRUBUTE_ROLL_BACK_TO_SNAPSHOT,
} = actions;
const { ROLLED_BACK, STARTING_UP, UP_TO_DATE, REPLAYING_ACTIONS } = states;

const enhanceReducer = (integrityCheck, baseReducer) => (state, action) => {
	console.log(action.type);
	const {
		actionChain = [],
		distrubuteStatus = STARTING_UP,
		...otherState
	} = state;

	if (action.type === DISTRIBUTE_REPLAY_ACTION) {
		const [previousAction = { id: "", integrity: "" }] = actionChain;
		return {
			actionChain: [
				{
					id: idFromAction(action.action),
					integrity: integrityCheck(
						previousAction,
						idFromAction(action.action),
					),
				},
				...actionChain,
			],
			distrubuteStatus: REPLAYING_ACTIONS,
			...baseReducer(otherState, action.action),
		};
	}

	if (action.type === DISTRIBUTE_UP_TO_DATE) {
		return {
			actionChain,
			distrubuteStatus: UP_TO_DATE,
			...otherState,
		};
	}

	if (action.type === DISTRUBUTE_ROLL_BACK_TO_SNAPSHOT) {
		return {
			...action.snapshot,
			distrubuteStatus: ROLLED_BACK,
		};
	}

	return {
		actionChain,
		distrubuteStatus,
		...baseReducer(otherState, action),
	};
};

export default enhanceReducer;
