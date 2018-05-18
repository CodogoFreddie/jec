import { actions } from "./consts";

const {
	DISTRIBUTE_REPLAY_ACTION,
	DISTRIBUTE_UP_TO_DATE,
	DISTRUBUTE_ROLL_BACK_TO_SNAPSHOT,
} = actions;

const startupDistrubute = store => async ({
	getAction,
	getSnapshot,
	integrityCheck,
	listActionIdsAfter,
	listAllSnapshotIds,
	removeSnapshot,
	setSnapshot,
}) => {
	const snapshotIds = await listAllSnapshotIds();

	if (snapshotIds.length === 0) {
		for await (const { id } of listActionIdsAfter()) {
			const action = await getAction(id);
			store.dispatch({
				type: DISTRIBUTE_REPLAY_ACTION,
				action,
			});

			const [
				mostRecentAction,
				previousAction,
			] = store.getState().actionChain;
			if (
				previousAction &&
				mostRecentAction.id.slice(0, 10) !==
					previousAction.id.slice(0, 10)
			) {
				await setSnapshot(
					store.getState().actionChain[0].id.split("_")[0],
					store.getState(),
				);
			}
		}

		store.dispatch({
			type: DISTRIBUTE_UP_TO_DATE,
		});
	} else {
		let foundCommonRoot = false;
		for (const mostRecentSnapshotId of snapshotIds) {
			if (foundCommonRoot) {
				break;
			}

			const mostRecentSnapshot = await getSnapshot(mostRecentSnapshotId);

			store.dispatch({
				type: DISTRUBUTE_ROLL_BACK_TO_SNAPSHOT,
				snapshot: mostRecentSnapshot,
			});

			const [mostRecentActionSnapshotted] = store.getState().actionChain;

			let checkingFirstAction = true;
			//calculate to see if we can replay from this point?
			for await (const { id, integrity } of listActionIdsAfter(
				mostRecentActionSnapshotted.id,
			)) {
				if (checkingFirstAction) {
					checkingFirstAction = false;
					if (integrity !== mostRecentActionSnapshotted.integrity) {
						console.log(
							"NEED TO ROLL BACK!!!",
							mostRecentSnapshotId,
						);

						await removeSnapshot(mostRecentSnapshotId);

						break;
					} else {
						foundCommonRoot = true;
					}
				}

				const action = await getAction(id);
				store.dispatch({
					type: DISTRIBUTE_REPLAY_ACTION,
					action,
				});

				const [
					mostRecentAction,
					previousAction,
				] = store.getState().actionChain;
				if (
					previousAction &&
					mostRecentAction.id.slice(0, 10) !==
						previousAction.id.slice(0, 10)
				) {
					await setSnapshot(
						store.getState().actionChain[0].id.split("_")[0],
						store.getState(),
					);
				}
			}
		}
	}

	await setSnapshot(
		store.getState().actionChain[0].id.split("_")[0],
		store.getState(),
	);
};

export default startupDistrubute;
