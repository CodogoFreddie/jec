import * as R from "ramda";
import crypto from "crypto";
import jsonfile from "jsonfile";
import mkdirp from "mkdirp";
import fs from "fs";

const cacheFolder =
	process.env.JEC_JASK_CACHE_FOLDER ||
	`${require("os").homedir()}/.jecJaskCache`;
const actionFolder =
	process.env.JEC_ACTIONS_FOLDER || `${require("os").homedir()}/.jecActions`;

const ensureActionFolderExists = () =>
	new Promise((done, fail) => {
		mkdirp(actionFolder, err => (err ? fail(err) : done()));
	});

const hashString = str =>
	crypto
		.createHash("md5")
		.update(str)
		.digest("hex");

//------------------------------
//          snapshots
//------------------------------

export const listAllSnapshotIds = () =>
	new Promise((done, fail) => {
		fs.readdir(
			cacheFolder,
			(err, files) => (err ? fail(err) : done(R.reverse(files) || [])),
		);
	});

export const getSnapshot = id =>
	ensureActionFolderExists().then(
		() =>
			new Promise((done, fail) =>
				jsonfile.readFile(
					`${cacheFolder}/${id}`,
					(err, data) => (err ? fail(err) : done(data)),
				),
			),
	);

export const setSnapshot = (id, snapshot) =>
	new Promise((done, fail) => {
		jsonfile.writeFile(
			`${cacheFolder}/${id}`,
			snapshot,
			err => (err ? fail(err) : done()),
		);
	});

export const removeSnapshot = id =>
	new Promise((done, fail) =>
		fs.unlink(`${cacheFolder}/${id}`, err => (err ? fail(err) : done())),
	);

//------------------------------
//           actions
//------------------------------

export const getAction = id =>
	ensureActionFolderExists().then(
		() =>
			new Promise((done, fail) => {
				jsonfile.readFile(
					`${actionFolder}/${id}`,
					(err, dat) => (err ? fail(err) : done(dat)),
				);
			}),
	);

export const setAction = action =>
	ensureActionFolderExists().then(
		() =>
			new Promise((done, fail) => {
				jsonfile.writeFile(
					`${actionFolder}/${action.timestamp}_${action.type}_${
						action.salt
					}`,
					action,
					err => (err ? fail(err) : done()),
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

export const listActionIdsAfter = async function* listActionIdsAfter(afterId) {
	const filenames = await wrappedGetFiles();

	const actions = filenames.reduce(
		(acc, id) => [
			...acc,
			{
				id,
				integrity: integrityCheck(acc.slice(-1)[0], id),
			},
		],
		[],
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

export const integrityCheck = ({ id = "", integrity = "" } = {}, newAction) =>
	hashString(id + integrity + newAction);
