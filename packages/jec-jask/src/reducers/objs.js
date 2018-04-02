import * as R from "ramda";

const sanitizeObjs = R.pipe(
	R.filter(Boolean),
	R.uniqBy(R.identity),
	R.sortBy(R.identity),
);

const objs = (state = [], action) => sanitizeObjs([ ...state, action.objId, ]);

export default objs;
