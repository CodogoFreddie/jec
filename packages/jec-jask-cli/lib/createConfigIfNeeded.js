import { createInsertStateAction } from "jec-action-helpers";

var packageJSON = require("../package.json");

export default (function (opperators) {
	var config = opperators.getConfig();

	if (!config || !config.jask || config.jask.version !== packageJSON.version) {
		console.log("no jask config detected! generating new config");
		return opperators.insertAction(createInsertStateAction({
			obj: "config",
			state: {
				jask: {
					version: packageJSON.version,
					headers: ["id", "score", "description", "due", "tags", "priority", "project", "depends", "recur"]
				}
			}
		})).then(function () {
			return opperators;
		});
	} else {
		return opperators;
	}
});