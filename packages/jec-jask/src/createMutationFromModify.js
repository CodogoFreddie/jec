import * as R from "ramda";
import df from "date-fns/fp";

import {
	hashToUUID,
	mutationifyObject,
	createInsertStateAction,
	createRemoveStateAction,
} from "jec-action-helpers";

import { parseDate, } from "./parseDateShorthands";

const getAndFormatAddativeTags = R.pipe(
	R.filter(R.test(/^\+/)),
	R.map(R.replace(/^\+/, "")),
);

const parseAndStringifyDate = R.pipe(
	parseDate,
	x => x.toISOString(),
);

const cleanNewState = R.pipe(
	R.evolve({
		tags: getAndFormatAddativeTags,
		due: parseAndStringifyDate,
		wait: parseAndStringifyDate,
	})
);

const getAndFormatSubtractiveTags = R.pipe(
	R.filter(R.test(/^\-/)),
	R.map(R.replace(/^\-/, "")),
);

export default ({ description, tags, props, }) => {
	const newState = cleanNewState({
		description,
		tags,
		...props,
	});

	const removeTags = {
		tags: getAndFormatSubtractiveTags(tags),
	};

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
