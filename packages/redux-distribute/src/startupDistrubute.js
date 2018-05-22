import { actions } from "./consts";

const {
	DISTRIBUTE_REPLAY_ACTION,
	DISTRIBUTE_UP_TO_DATE,
	DISTRUBUTE_ROLL_BACK_TO_SNAPSHOT,
} = actions;

const saveSnapshot = async ({ setSnapshot, state }) => {
	//const [mostRecentAction, previousAction] = state.actionChain;
	//if (
	//previousAction &&
	//mostRecentAction.id.slice(0, 10) !== previousAction.id.slice(0, 10)
	//) {
	await setSnapshot(state.actionChain[0].id.split("_")[0], state);
	//}
};

const rebuildFromScratch = async ({
	listActionIdsAfter,
	store,
	setSnapshot,
	getAction,
}) => {
	for await (const { id } of listActionIdsAfter()) {
		const action = await getAction(id);
		store.dispatch({
			type: DISTRIBUTE_REPLAY_ACTION,
			action,
		});

		saveSnapshot({
			setSnapshot,
			state: store.getState(),
		});
	}

	store.dispatch({
		type: DISTRIBUTE_UP_TO_DATE,
	});
};

const rebuildFromSnapshot = ({
	getAction,
	getSnapshot,
	listActionIdsAfter,
	removeSnapshot,
	setSnapshot,
	snapshotIds,
	store,
}) => {
	const recursive = async ([headSnapshotId, ...snapshotIds]) => {
		console.log({ headSnapshotId });
		//fallback procedure
		if (!headSnapshotId) {
			await rebuildFromScratch({
				listActionIdsAfter,
				store,
				setSnapshot,
				getAction,
			});
			return;
		}

		const headSnapshot = await getSnapshot(headSnapshotId);

		store.dispatch({
			type: DISTRUBUTE_ROLL_BACK_TO_SNAPSHOT,
			snapshot: headSnapshot,
		});

		const [
			{ id: headActionId, integrity: headActionIntegrity },
		] = store.getState().actionChain;

		let firstAction = true;
		let couldRebuild;
		for await (const { id, integrity } of listActionIdsAfter(
			headActionId,
		)) {
			if (firstAction) {
				firstAction = false;
				couldRebuild =
					id === headActionId && integrity === headActionIntegrity;
				if (!couldRebuild) {
					break;
				} else {
					continue;
				}
			}

			//apply the action
			const action = await getAction(id);
			store.dispatch({
				type: DISTRIBUTE_REPLAY_ACTION,
				action,
			});

			saveSnapshot({
				setSnapshot,
				state: store.getState(),
			});
		}

		if (!couldRebuild) {
			await recursive(snapshotIds);
		} else {
			store.dispatch({
				type: DISTRIBUTE_UP_TO_DATE,
			});
		}
	};

	return recursive;
};

const startupDistrubute = store => async handlers => {
	const snapshotIds = await handlers.listAllSnapshotIds();

	const rebuilder = rebuildFromSnapshot({ ...handlers, store });
	await rebuilder(snapshotIds);
};

export default startupDistrubute;
