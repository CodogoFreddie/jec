import * as R from "ramda";
import localForage from "localforage";
import createJecJaskStore from "jec-jask";

import { getServerDetails } from "../services/serverDetails";

//------------------------------
//          snapshots
//------------------------------

const snapshotStorage = localForage.createInstance({
	name: "snapshots",
});

const mostRecentFirst = R.pipe(R.sortBy(R.identity), R.reverse);

const listAllSnapshotIds = async () => {
	const ids = await snapshotStorage.keys();
	return mostRecentFirst(ids);
};

const getSnapshot = async id => {
	return await snapshotStorage.getItem(id);
};

const setSnapshot = async (id, state) => {
	return await snapshotStorage.setItem(id, state);
};

const removeSnapshot = async id => {
	return await snapshotStorage.removeItem(id);
};

//------------------------------
//           actions
//------------------------------

const actions = {};
const getManyActions = ids => {
	let [imediate, queued] = R.splitAt(20, ids);

	const requestThenAnother = async id => {
		await getAction(id);

		const [nextId, ...rest] = queued;
		queued = rest;

		requestThenAnother(nextId);
	};

	imediate.forEach(requestThenAnother);
};

const getAction = async id => {
	if (actions[id]) {
		return actions[id];
	}

	const { authKey, address } = await getServerDetails();

	const resp = await fetch(address + "/" + id, {
		headers: {
			Authorization: authKey,
		},
	});

	const action = await resp.json();

	actions[id] = action;

	return action;
};

const setAction = async (id, action) => console.log("set action", id, action);

const listActionIdsAfter = async function*(afterId) {
	const { authKey, address } = await getServerDetails();

	const resp = await fetch(address, {
		headers: {
			Authorization: authKey,
		},
	});

	const ids = await resp.json();

	const actions = ids.reduce(
		(acc, id) => [
			...acc,
			{
				id,
				integrity: integrityCheck(acc.slice(-1)[0], id),
			},
		],
		[],
	);

	getManyActions(
		actions.map(R.prop("id")).filter(id => afterId || afterId <= id),
	);

	for await (const { id, integrity } of actions) {
		if (!afterId || afterId <= id) {
			yield {
				id,
				integrity,
			};
		}
	}
};

const integrityCheck = ({ id = "", integrity = "" } = {}, newAction) => {
	const str = id + integrity + newAction;

	var hash = 0;
	for (var i = 0; i < str.length; i++) {
		var char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
};

//------------------------------
//           store
//------------------------------

const store = createJecJaskStore({
	listAllSnapshotIds,
	getSnapshot,
	setSnapshot,
	removeSnapshot,
	getAction,
	setAction,
	listActionIdsAfter,
	integrityCheck,
});

export default store;
