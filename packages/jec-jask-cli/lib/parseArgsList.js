import * as R from "ramda";

var uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
var keyworkRegex = /(add|modify|delete|done|start|stop)/;

export default (function (args) {
	var _R$splitWhen = R.splitWhen(R.test(keyworkRegex), args.filter(R.length)),
	    filter = _R$splitWhen[0],
	    _R$splitWhen$ = _R$splitWhen[1],
	    keyword = _R$splitWhen$[0],
	    modifiers = _R$splitWhen$.slice(1);

	var filterPresent = !!filter.length;
	var modifiersPresent = !!modifiers.length;

	var groupArgs = R.pipe(R.groupBy(function (x) {
		return R.test(/^[0-9]+$/, x) && "ids" || R.test(uuidRegex, x) && "uuids" || R.test(/^[a-zA-Z0-9]+:.+$/, x) && "props" || R.test(/^[+-][a-zA-Z0-9]+$/, x) && "tags" || "description";
	}), R.over(R.lensProp("ids"), R.defaultTo([])), R.over(R.lensProp("uuids"), R.defaultTo([])), R.over(R.lensProp("props"), R.defaultTo([])), R.over(R.lensProp("tags"), R.defaultTo([])), R.over(R.lensProp("description"), R.defaultTo([])), R.over(R.lensProp("description"), R.join(" ")), R.over(R.lensProp("props"), R.pipe(R.map(R.split(":")), R.fromPairs)));

	return R.pipe(R.evolve({
		filter: groupArgs,
		modifiers: groupArgs
	}))({
		filter: filter,
		keyword: keyword,
		modifiers: modifiers,
		filterPresent: filterPresent,
		modifiersPresent: modifiersPresent
	});
});