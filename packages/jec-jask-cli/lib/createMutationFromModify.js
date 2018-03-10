import * as R from "ramda";

import { createInsertStateAction, createRemoveStateAction } from "jec-action-helpers";

import { parseDate, parseRecur } from "./parseDateShorthands";

var getAndFormatAddativeTags = R.pipe(R.filter(R.test(/^\+/)), R.map(R.replace(/^\+/, "")));

var parseAndStringifyDate = R.pipe(parseDate, function (x) {
	return x.toISOString();
});

var cleanNewState = R.pipe(R.evolve({
	tags: getAndFormatAddativeTags,
	due: parseAndStringifyDate,
	wait: parseAndStringifyDate,
	recur: parseRecur
}), R.filter(Boolean));

var getAndFormatSubtractiveTags = R.pipe(R.filter(R.test(/^-/)), R.map(R.replace(/^-/, "")));

export default (function (_ref) {
	var description = _ref.description,
	    tags = _ref.tags,
	    props = _ref.props;

	var newState = cleanNewState(Object.assign({
		description: description.length ? description : undefined,
		tags: tags
	}, props));

	var removeTags = {
		tags: getAndFormatSubtractiveTags(tags)
	};

	console.log({
		newState: newState
	});

	return [].concat(createInsertStateAction({
		obj: "__",
		state: newState
	}).mutations, createRemoveStateAction({
		obj: "__",
		state: removeTags
	}).mutations);
});