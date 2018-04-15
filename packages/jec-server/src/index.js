import express from "express";
import cors from "cors";
import fs from "fs";
import jsonfile from "jsonfile";

const app = express();

const actionFolder =
	process.env.JEC_ACTIONS_FOLDER || `${ require("os").homedir() }/.jecActions`;

const authKey =
	process.env.JEC_HTTP_SERVER_KEY ||
	Math.random()
		.toString(36)
		.substring(7);

const port = process.env.JEC_HTTP_SERVER_PORT || 9000;

const isCorrectKey = ({ headers, }) => (headers.authorization = authKey);

app.options("*", cors());
app.get("/", cors(), (req, res, next) => {
	console.log("list all");

	if (isCorrectKey(req)) {
		fs.readdir(actionFolder, (err, files) => {
			return res.status(200).json(files);
		});
	} else {
		return res.status(403).send("bad Authorization header");
	}
});

app.get("/:id", cors(), (req, res, next) => {
	console.log(`get ${ req.params.id }`);

	if (isCorrectKey(req)) {
		jsonfile.readFile(`${ actionFolder }/${ req.params.id }`, (err, dat) => {
			if (err) {
				return res.status(500).send("no such action");
			} else {
				return res.status(200).json(dat);
			}
		});
	} else {
		res.status(403).send("bad Authorization header");
	}
});

app.listen(port, () =>
	console.log(
		`jec http server listening on port ${ port } with auth key "${ authKey }"`,
	),
);
