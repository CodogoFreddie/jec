import * as R from "ramda";
import startPure from "jec-pure-cli";

startPure(console.log).then( ({ getState, insertState, removeState, }) => {
	const state = getState();

:xa
	if(!R.path([ "config", "jask", ], state)){
		console.log("no jask config detected!");
		insertState({
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
		});
	}

	console.log( getState());
});
