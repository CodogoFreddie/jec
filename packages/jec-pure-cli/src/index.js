import fetchConfig from "jec-config-fetcher";
import jsonfile from "jsonfile";
import mkdir from "make-dir";
import recursive from "recursive-readdir";
import * as R from "ramda";

import {
	setPersistHandlers,
	initalise,
	getState,
	getStateArr,
	getConfig,
	insertAction,
	insertActions,
} from "jec-engine";

export default listener =>
	fetchConfig(listener)
		.then(config => {
			setPersistHandlers({
				listActions: () =>
					new Promise(done => {
						recursive(config.dataFolder, (err, files) => {
							err
								? done([])
								: done(
									files.map(
										R.replace(
											config.dataFolder + "/",
											"",
										),
									) || [],
								);
						});
					}),

				readAction: filename =>
					new Promise((done, fail) =>
						jsonfile.readFile(
							config.dataFolder + "/" + filename,
							(err, dat) => (err ? fail(err) : done(dat)),
						),
					),

				writeAction: action => {
					const folder =
						config.dataFolder.replace(/\/?$/, "/") +
						"/" +
						action.meta.obj;
					const filename = folder + "/" + action.meta.time;

					return mkdir(folder).then(() =>
						jsonfile.writeFile(filename, action, {
							spaces: 2,
						}),
					);
				},
			});

			return initalise();
		})
		.then(() => ({
			getState,
			getStateArr,
			getConfig,
			insertAction,
			insertActions,
		}));
