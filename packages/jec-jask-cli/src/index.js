import createJecJaskStore from "jec-jask";
import { AsyncNodeStorage, } from "redux-persist-node-storage";

import parseCli from "./parseCli";
import generateAddActions from "./generateAddActions";

process.on("unhandledRejection", r => console.log(r));

const cacheFolder =
	process.env.JEC_JASK_CACHE_FOLDER ||
	`${ require("os").homedir() }/.jecJaskCache`;

const store = createJecJaskStore({
	persistStorage: new AsyncNodeStorage(cacheFolder),
});

let hasRunCliCommand = false;
store.subscribe(() => {
	if (!hasRunCliCommand) {
		const { _persist: { rehydrated, }, } = store.getState();

		if (rehydrated) {
			hasRunCliCommand = true;

			const { filter, command, modifications, } = parseCli(process.argv);

			const actionGenerator = {
				add: generateAddActions,
			}[command];

			const { actions, filterForRender, } = actionGenerator({
				filter,
				modifications,
				state: store.getState(),
			});

			actions.forEach(store.dispatch);

			console.log(JSON.stringify(store.getState(), null, 2));
		}
	}
});
