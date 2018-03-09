import * as R from "ramda";

const filterByTags = tags => ({ tags: objectTags = [], }) => {
	const splitTags = R.pipe(
		R.partition(R.test(/^\+/)),
		R.map(R.map(R.replace(/^./, ""))),
	);
	const [yesTags, noTags,] = splitTags(tags);

	const matchedYes = !!R.intersection(yesTags, objectTags).length;
	const matchedNo = !!R.intersection(noTags, objectTags).length;

	return matchedYes && !matchedNo;
};

export default ({ ids, uuids, props, tags, description, }) => {
	const tests = [
		ids.length && (({ id, }) => ids.includes(id.toString())),
		uuids.length && (({ uuid, }) => uuids.includes(uuid)),
		description.length &&
			(({ description: objectDesc, }) => objectDesc.includes(description)),
		tags.length && filterByTags(tags),
		props.project &&
			(({ project = "", }) => project.includes(props.project)),
	].filter(Boolean);

	const filterer = tests.length ? R.filter(R.anyPass(tests)) : R.identity;

	return R.pipe(filterer, R.map(R.prop("uuid")));
};
