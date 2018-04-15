import * as R from "ramda";
import jsonfile from "jsonfile";
import mkdirp from "mkdirp";
import fs from "fs";
import { AsyncNodeStorage, } from "redux-persist-node-storage";

const cacheFolder =
	process.env.JEC_JASK_CACHE_FOLDER ||
	`${ require("os").homedir() }/.jecJaskCache`;
const actionFolder =
	process.env.JEC_ACTIONS_FOLDER || `${ require("os").homedir() }/.jecActions`;

const ensureActionFolderExists = () =>
	new Promise((done, fail) => {
		mkdirp(actionFolder, err => (err ? fail(err) : done()));
	});

export const writeAction = action =>
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

export const readAction = id =>
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

export const listAllActions = async function* listAllActions() {
	const files = await wrappedGetFiles();
	for await (const id of files) {
		yield id;
	}
};

export const persistStorage = new AsyncNodeStorage(cacheFolder);
