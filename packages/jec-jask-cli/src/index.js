import createJecJaskStore, { collateAllObjects, } from "jec-jask";
import * as R from "ramda";
import jsonfile from "jsonfile";
import mkdirp from "mkdirp";
import fs from "fs";
import { AsyncNodeStorage, } from "redux-persist-node-storage";

import parseCli from "./parseCli";
import generateAddActions from "./generateAddActions";

process.on("unhandledRejection", r => console.log(r));

const cacheFolder =
	process.env.JEC_JASK_CACHE_FOLDER ||
	`${ require("os").homedir() }/.jecJaskCache`;
const actionFolder =
	process.env.JEC_JASK_CACHE_FOLDER ||
	`${ require("os").homedir() }/.jecActions`;

const ensureActionFolderExists = () =>
	new Promise((done, fail) => {
		mkdirp(actionFolder, err => (err ? fail(err) : done()));
	});

const writeAction = action =>
	ensureActionFolderExists().then(
		() =>
			new Promise((done, fail) => {
				jsonfile.writeFile(
					`${ actionFolder }/${ action.timestamp }_${ action.type }_${
						action.salt
					}`,
					action,
					err => (err ? fail(err) : done()),
				);
			}),
	);

const readAction = id =>
	ensureActionFolderExists().then(
		() =>
			new Promise((done, fail) => {
				jsonfile.readFile(
					`${ actionFolder }/${ id }`,
					(err, dat) => (err ? fail(err) : done(dat)),
				);
			}),
	);

const wrappedGetFiles = () =>
	ensureActionFolderExists().then(
		() =>
			new Promise((done, fail) => {
				fs.readdir(
					actionFolder,
					(err, files) => (err ? fail(err) : done(files || [])),
				);
			}),
	);

async function* listAllActions() {
	const files = await wrappedGetFiles();
	for await (const id of files) {
		yield id;
	}
}

const store = createJecJaskStore({
	listAllActions,
	writeAction,
	readAction,
	persistStorage: new AsyncNodeStorage(cacheFolder),
});

let hasRunCliCommand = false;
store.subscribe(() => {
	if (!hasRunCliCommand) {
		const { __distributeStatus, } = store.getState();

		if (__distributeStatus === "READY") {
			hasRunCliCommand = true;

			const { filter, command, modifications, } = parseCli(process.argv);

			const noop = () => ({ actions: [], filterForRender: R.identity, });
			const actionGenerator =
				{
					add: generateAddActions,
				}[command] || noop;

			const { actions, filterForRender, } = actionGenerator({
				filter,
				modifications,
				state: store.getState(),
			});

			actions.forEach(store.dispatch);

			console.log(JSON.stringify(collateAllObjects(store.getState()), null, 2));
		}
	}
});
