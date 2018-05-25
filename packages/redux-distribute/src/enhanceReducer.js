import { actions, states } from "./consts";

import { idFromAction } from "./lib";

const {
	DISTRIBUTE_REPLAY_ACTION,
	DISTRIBUTE_UP_TO_DATE,
	DISTRIBUTE_ROLL_BACK_TO_SNAPSHOT,
} = actions;
const { ROLLED_BACK, STARTING_UP, UP_TO_DATE, REPLAYING_ACTIONS } = states;

const enhanceReducer = (integrityCheck, baseReducer) => (state, action) => {
	const {
		actionChain = [],
		distributeStatus = STARTING_UP,
		...otherState
	} = state;

	if (action.type === DISTRIBUTE_REPLAY_ACTION) {
		const [previousAction] = actionChain;
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
			distributeStatus: REPLAYING_ACTIONS,
			...baseReducer(otherState, action.action),
		};
	}

	if (action.type === DISTRIBUTE_UP_TO_DATE) {
		return {
			actionChain,
			distributeStatus: UP_TO_DATE,
			...otherState,
		};
	}

	if (action.type === DISTRIBUTE_ROLL_BACK_TO_SNAPSHOT) {
		return {
			...action.snapshot,
			distributeStatus: ROLLED_BACK,
		};
	}

	return {
		actionChain,
		distributeStatus,
		...baseReducer(otherState, action),
	};
};

export default enhanceReducer;
