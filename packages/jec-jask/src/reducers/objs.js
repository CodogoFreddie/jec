// @flow
import * as R from "ramda";

import type { Action } from "./index";

type Objs = Array<string>

const sanitizeObjs = R.pipe(
	R.filter(Boolean),
	R.uniqBy(R.identity),
	R.sortBy(R.identity),
)

const objs = (state: Objs = [], action: Action): Objs => sanitizeObjs([
	...state,
	action.objId,
])

export default objs
