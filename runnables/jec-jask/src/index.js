import startPure from "jec-pure-cli";

const createConfigIfNeeded = opperators => {
	const config = opperators.getConfig();
	if (!config || !config.jask) {
		console.log("no jask config detected! generating new config");
		return opperators
			.insertState({
				obj: "config",
				state: {
					jask: {
						headers: [
							"score",
							"id",
							"description",
							"due",
							"tags",
							"priority",
							"project",
							"depends",
							"recur",
						],
					},
				},
			})
			.then(() => opperators);
	} else {
		return opperators;
	}
};

startPure(console.log)
	.then(createConfigIfNeeded)
	.then(({ getState, getConfig, }) => {
		console.log(getState());
		console.log(getConfig());
	});
