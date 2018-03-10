import * as R from "ramda";

var filterByTags = function filterByTags(tags) {
	return function (_ref) {
		var _ref$tags = _ref.tags,
		    objectTags = _ref$tags === undefined ? [] : _ref$tags;

		var splitTags = R.pipe(R.partition(R.test(/^\+/)), R.map(R.map(R.replace(/^./, ""))));

		var _splitTags = splitTags(tags),
		    yesTags = _splitTags[0],
		    noTags = _splitTags[1];

		var matchedYes = !!R.intersection(yesTags, objectTags).length;
		var matchedNo = !!R.intersection(noTags, objectTags).length;

		return matchedYes && !matchedNo;
	};
};

export default (function (_ref2) {
	var ids = _ref2.ids,
	    uuids = _ref2.uuids,
	    props = _ref2.props,
	    tags = _ref2.tags,
	    description = _ref2.description;

	var tests = [ids.length && function (_ref3) {
		var id = _ref3.id;
		return ids.includes(id.toString());
	}, uuids.length && function (_ref4) {
		var uuid = _ref4.uuid;
		return uuids.includes(uuid);
	}, description.length && function (_ref5) {
		var objectDesc = _ref5.description;
		return objectDesc.includes(description);
	}, tags.length && filterByTags(tags), props.project && function (_ref6) {
		var _ref6$project = _ref6.project,
		    project = _ref6$project === undefined ? "" : _ref6$project;
		return project.includes(props.project);
	}].filter(Boolean);

	var filterer = tests.length ? R.filter(R.anyPass(tests)) : R.identity;

	return R.pipe(filterer, R.map(R.prop("uuid")));
});