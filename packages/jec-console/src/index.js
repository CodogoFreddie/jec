import * as R from "ramda";
import util from "util";
import genUUID from "uuid/v4";
import startPure from "jec-pure-cli";

startPure().then(({ getState, insertState, }) => {
	console.log();
	const [_, __, uuid, input,] = process.argv;

	if (!uuid) {
		console.log(
			`
# Syntax:

$ jec :
	print all object UUIDs

$ jec add :
	create a new jec object, and return the uuid

$ jec cff750ef-2c9c-41dc-8811-3741c6e80313 :
	print the data associated with cff750ef-2c9c-41dc-8811-3741c6e80313

$ jec cff750ef-2c9c-41dc-8811-3741c6e80313 - :
	add the data from stdin to cff750ef-2c9c-41dc-8811-3741c6e80313

__NOT YET IMPLEMENTED__
$ jec cff750ef-2c9c-41dc-8811-3741c6e80313 /path/to/file.json :
	add the data found in /path/to/file.json to cff750ef-2c9c-41dc-8811-3741c6e80313

`,
			R.keys(getState()).join("\n"),
		);
	}

	if (uuid) {
		if (!input) {
			if (uuid === "add") {
				insertState({
					obj: genUUID(),
					state: {
						generatedBy: "jec-console",
					},
				});
			}

			console.log(
				util.inspect({
					uuid,
					...getState()[uuid],
				}),
			);
		} else {
			if (input === "-") {
				const stdin = process.stdin;
				const inputChunks = [];

				process.stdin.resume();
				process.stdin.setEncoding("utf8");

				process.stdin.on("data", function(chunk) {
					inputChunks.push(chunk);
				});

				stdin.on("end", function() {
					const inputJSON = inputChunks.join();
					const state = JSON.parse(inputJSON);

					insertState({
						obj: uuid,
						state,
					});

					console.log(R.keys(getState()).join("\n"));
				});
			}
		}
	}
});
