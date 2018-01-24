import produceUUID from "uuid/v3";
import {
	reifyFunction as R,
	reifyUncalledFunction as E,
} from "jec-action-helpers";

const packageJSON = require("../package.json");

export default {
	isAfterware: true,
	name: "Recur On Done",
	app: packageJSON.jec.uuid,
	version: packageJSON.version,
	uuid: produceUUID("Recur On Done", packageJSON.jec.uuid),

	function: R.ifElse(
		R.both(
			R.complement(R.path(["before", "done",])),
			R.path(["after", "done",]),
		),
		R.pipe(
			R.over(
				R.lens(
					R.path(["action", "meta", "obj",]),
					R.assocPath(["newAction", "meta", "obj",]),
				),
				E.hashToUUID,
			),

			R.over(
				R.lens(
					R.path(["action", "meta", "time",]),
					R.assocPath(["newAction", "meta", "time",]),
				),
				E.inc,
			),

			R.over(
				R.lens(
					R.path(["action", "meta", "obj",]),
					R.assocPath(["newAction", "meta", "action",]),
				),
				R.pipe(R.split(""), R.append("_"), R.join(""), E.hashToUUID),
			),

			R.over(
				R.lens(
					R.path(["action", "meta", "action",]),
					R.assocPath(["newAction", "meta", "childOfAction",]),
				),
				E.identity,
			),

			R.over(
				R.lens(
					R.path(["after",]),
					R.assocPath(["newAction", "mutations",]),
				),
				R.pipe(
					E.mutationifyObject,
					R.reject(R.pathEq(["path", 0,], "uuid")),

					R.map(
						R.over(
							R.lensProp("type"),
							R.cond([
								[R.equals("after"), R.always("assoc"),],
								[R.equals("arr"), R.always("add"),],
							]),
						),
					),
					R.reject(R.pathEq(["path", 0,], "done")),
				),
			),

			R.prop("newAction"),
		),
		R.always([]),
	),
};
