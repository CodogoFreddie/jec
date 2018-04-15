import * as R from "ramda";

const sanitizeObjs = R.pipe(
	R.filter(Boolean),
	R.uniqBy(R.identity),
	R.sortBy(R.identity),
);

const objs = (state = [], action) => {
	if (action.objId) {
		return sanitizeObjs([ ...state, action.objId, ]);
	} else {
		return state;
	}
};

export default objs;
