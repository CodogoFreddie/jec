import express from "express";
import cors from "cors";
import fs from "fs";
import jsonfile from "jsonfile";
import crypto from "crypto";

const app = express();

const actionFolder =
	process.env.JEC_ACTIONS_FOLDER || `${require("os").homedir()}/.jecActions`;

const authKey =
	process.env.JEC_HTTP_SERVER_KEY ||
	Math.random()
		.toString(36)
		.substring(7);

const port = process.env.JEC_HTTP_SERVER_PORT || 9000;

const isCorrectKey = ({ headers }) => headers.authorization === authKey;

app.options("*", cors());
app.get("/meta/:id?", cors(), (req, res, next) => {
	const id = req.params.id;
	console.log(`meta ${req.params.id}`);

	if (!isCorrectKey(req)) {
		return res.status(403).send("bad Authorization header");
	}

	fs.readdir(actionFolder, (err, files) => {
		const hashChain = files.reduce(
			(acc, id) => [
				...acc,
				crypto
					.createHash("sha256")
					.update(id + acc[acc.length - 1])
					.digest("base64"),
			],
			[],
		);

		const mostRecentIndex = id
			? files.findIndex(x => x === id)
			: files.length - 1;

		const response = [
			{
				id: files[mostRecentIndex],
				chainHash: hashChain[mostRecentIndex],
			},
		];

		for (let i = 1; i < files.length; i *= 2) {
			response.push({
				id: files[mostRecentIndex - i],
				chainHash: hashChain[mostRecentIndex - i],
			});
		}

		return res.status(200).json(response);
	});
});

app.get("/action/:id", cors(), (req, res, next) => {
	console.log(`get ${req.params.id}`);

	if (!isCorrectKey(req)) {
		return res.status(403).send("bad Authorization header");
	}

	jsonfile.readFile(`${actionFolder}/${req.params.id}`, (err, dat) => {
		if (err) {
			return res.status(500).send("no such action");
		} else {
			return res.status(200).json(dat);
		}
	});
});

app.listen(port, () =>
	console.log(
		`jec http server listening on port ${port} with auth key "${authKey}", serving actions from "${actionFolder}"`,
	),
);
