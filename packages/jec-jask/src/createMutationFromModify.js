import * as R from "ramda";

import {
	createInsertStateAction,
	createRemoveStateAction,
} from "jec-action-helpers";

import { parseDate, parseRecur, } from "./parseDateShorthands";

const getAndFormatAddativeTags = R.pipe(
	R.filter(R.test(/^\+/)),
	R.map(R.replace(/^\+/, "")),
);

const parseAndStringifyDate = R.pipe(parseDate, x => x.toISOString());

const cleanNewState = R.pipe(
	R.evolve({
		tags: getAndFormatAddativeTags,
		due: parseAndStringifyDate,
		wait: parseAndStringifyDate,
		recur: parseRecur,
	}),
	R.filter(Boolean),
);

const getAndFormatSubtractiveTags = R.pipe(
	R.filter(R.test(/^-/)),
	R.map(R.replace(/^-/, "")),
);

export default ({ description, tags, props, }) => {
	const newState = cleanNewState({
		description: description.length ? description : undefined,
		tags,
		...props,
	});

	const removeTags = {
		tags: getAndFormatSubtractiveTags(tags),
	};

	console.log({
		newState,
	});

	return [
		...createInsertStateAction({
			obj: "__",
			state: newState,
		}).mutations,
		...createRemoveStateAction({
			obj: "__",
			state: removeTags,
		}).mutations,
	];
};
