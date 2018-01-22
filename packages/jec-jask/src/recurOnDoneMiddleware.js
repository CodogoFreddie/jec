import { reifyFunction as R } from "jec-action-helpers";

export default R.ifElse(
	R.both(
		R.complement(R.path([ "before", "done", ])),
		R.path([ "after", "done", ]),
	),
	R.pipe(
		R.over(
			R.lens(
				R.path(["action", "meta", "obj",]),
				R.assocPath([ "newAction", "meta", "obj", ]),
			),
			{ op: "hashToUUID", },
		),

		R.over(
			R.lens(
				R.path(["action", "meta", "time",]),
				R.assocPath([ "newAction", "meta", "time", ]),
			),
			R.inc,
		),

		R.over(
			R.lens(
				R.path(["action", "meta", "obj",]),
				R.assocPath([ "newAction", "meta", "action", ]),
			),
			R.pipe(
				R.split(""),
				R.append("_"),
				R.join(""),
				{ op: "hashToUUID", },
			),
		),

		R.over(
			R.lens(
				R.path(["action", "meta", "action", ]),
				R.assocPath([ "newAction", "meta", "childOfAction", ]),
			),
			R.identity,
		),

		R.over(
			R.lens(
				R.path([ "after", ]),
				R.assocPath([ "newAction", "mutations", ]),
			),
			R.pipe(
				{op: "mutationifyObject" },
				R.reject(R.pathEq( ["path", 0,], "uuid" )),

				R.map(R.over(
					R.lensProp("type"),
					R.cond([
						[
							R.equals("after"),
							R.always("assoc"),
						],
						[
							R.equals("arr"),
							R.always("add"),
						],
					]),
				)),
				R.reject(
					R.pathEq(["path", 0], "done")
				),
			)
		),

		R.prop("newAction"),

	),
	R.always([]),
);
