import * as R from "ramda";
import genUUID from "uuid/v4";
import startPure from "jec-pure-cli";

startPure(console.log).then( ({ getState, getConfig, insertState, removeState, }) => {
	const state = getState();
	const config = getConfig();
	if(!config || !config.jask){
		console.log("no jask config detected! generating new config");
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

	//insertState({
		//obj: genUUID(),
		//state: {
			//description: "this is the description",
			//due: 12345,
			//tags: [
				//"testing",
				//"trial",
				//"jask",
			//]
		//}
	//});

	console.log( getState());
	console.log(getConfig());
});
