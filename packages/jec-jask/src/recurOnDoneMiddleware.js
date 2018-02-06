import produceUUID from "uuid/v3";
import { inspect, } from "util";
import * as dateFns from "date-fns/fp";
import * as R from "ramda";
import {
	callArray,
	//reifyFunction as R,
	//reifyUncalledFunction as E,
} from "jec-action-helpers";

const packageJSON = require("../package.json");

//console.log(
	//dateFns.addDays(1, new Date("2018-01-31T10:29:52.406Z")),
	//R.call(dateFns.addDays, 1, new Date("2018-01-31T10:29:52.406Z")),
	//callArray([dateFns.addDays, 1, new Date("2018-01-31T10:29:52.406Z")]),
//)

console.log(dateFns.addMonths.toString());

console.log( inspect(
	R.pipe(
		R.over(
			R.lensProp("due"),
			dateFns.toDate,
		),

		R.over(
			R.lens(
				R.path(["recur", "op",]),
				R.assoc("recur_op"),
			),
			R.identity,
		),

		R.over(
			R.lens(
				R.path(["recur", "n",]),
				R.assoc("recur_n"),
			),
			R.identity,
		),

		R.dissoc("recur"),

		R.over(
			R.lensProp("recur_op"),
			R.cond([
				[
					R.equals("addDays"),
					dateFns.addMonths,
				]
			])
		),

		R.toPairs,

		R.sortBy(R.nth(0)),

		R.reverse,

		R.map(R.nth(1)),

		R.tap(console.log),

		callArray,

		//R.over(
		//R.lensProp("recur"),
		//R.pipe(
		//R.toPairs,
		//R.map(
		//R.over(
		//R.lensIndex(0),
		//R.concat("recur_"),
		//)
		//),
		//),
		//),

		//R.toPairs,
		//R.flatten,

		//R.over(
		//R.lensProp("due"),
		//R.invoker(0, "toISOString"),
		//),
	)({
		due: "2018-02-01T10:17:00.165Z",
		recur: {
			op: "addDays",
			n: 1,
		},
	}),
	{
		depth: null,
	}
)
);

//export default {
//isAfterware: true,
//name: "Recur On Done",
//app: packageJSON.jec.uuid,
//version: packageJSON.version,
//uuid: produceUUID("Recur On Done", packageJSON.jec.uuid),

//function: R.ifElse(

////check to see if this is the sort of change we want to listen to:
////an object has a done field, where there didn't used to be one
//R.both(
//R.complement(R.path(["before", "done",])),
//R.path(["after", "done",]),
//),

////create the new action
//R.pipe(
//// set the meta
//R.over(
//R.lens(
//R.path(["action", "meta", "obj",]),
//R.assocPath(["newAction", "meta", "obj",]),
//),
//E.hashToUUID,
//),

//R.over(
//R.lens(
//R.path(["action", "meta", "time",]),
//R.assocPath(["newAction", "meta", "time",]),
//),
//E.inc,
//),

//R.over(
//R.lens(
//R.path(["action", "meta", "obj",]),
//R.assocPath(["newAction", "meta", "action",]),
//),
//R.pipe(R.split(""), R.append("_"), R.join(""), E.hashToUUID),
//),

//R.over(
//R.lens(
//R.path(["action", "meta", "action",]),
//R.assocPath(["newAction", "meta", "parent",]),
//),
//E.identity,
//),

////create the mutations of the new action
//R.over(
//R.lens(
//R.path(["after",]),
//R.assocPath(["newAction", "mutations",]),
//),
//R.pipe(
////update the due field using the recur field
//E.mutationifyObject,
//R.reject(R.pathEq(["path", 0,], "uuid")),

//R.map(
//R.over(
//R.lensProp("type"),
//R.cond([
//[R.equals("obj"), R.always("assoc"),],
//[R.equals("arr"), R.always("add"),],
//]),
//),
//),
//R.reject(R.pathEq(["path", 0,], "done")),
//),
//),

//R.prop("newAction"),
//),
//R.always([]),
//),
//};
