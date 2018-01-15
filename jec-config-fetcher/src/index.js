import fs from "fs";
import R from "ramda";

const dotfilePath = `${require("os").homedir()}/.jaskrc.js`;
let config = null;

export default () =>
	config
		? Promise.resolve(config)
		: new Promise(done => {
			try {
				config = require(dotfilePath);
				done(config);
			} catch (e) {
				if (e.code === "MODULE_NOT_FOUND") {
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
	dataFolder: \`${require("os").homedir()}/.jaskActions\`,
	server: {
		port: 9000,
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
