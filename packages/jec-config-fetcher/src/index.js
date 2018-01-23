import fs from "fs";
import * as R from "ramda";

const dotfilePath = `${require("os").homedir()}/.jecrc.js`;
let config = null;
const noop = () => {};

export default (listener = noop) =>
	config
		? (() => {
			listener(`read config from ${dotfilePath}`);
			Promise.resolve(config);
		})()
		: new Promise(done => {
			try {
				listener(`trying to read config from ${dotfilePath}`);
				config = require(dotfilePath);
				listener(`read config from ${dotfilePath}`);
				done(config);
			} catch (e) {
				if (e.code === "MODULE_NOT_FOUND") {
					listener(
						`failed, creating new config at ${dotfilePath}`,
					);
					const possible =
							"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
					const generateKey = () =>
						R.times(
							() =>
								possible.charAt(
									Math.floor(
										Math.random() * possible.length,
									),
								),
							128,
						).join("");

					fs.writeFile(
						dotfilePath,
						`module.exports = {
	dataFolder: \`${require("os").homedir()}/.jecActions\`,
	server: {
		port: 9000,
		address: "http:localhost",
		key: "${generateKey()}",
	},
}`,
						() => {
							console.log(
								`created a config file at ${dotfilePath}`,
							);
							config = require(dotfilePath);
							done(config);
						},
					);
				}
			}
		});
