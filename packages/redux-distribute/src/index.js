import * as R from "ramda";

import startupDistrubute from "./startupDistrubute";
import enhanceReducer from "./enhanceReducer";
import wrapDispatch from "./wrapDispatch";

const createStoreEnhancer = handlers => {
	const storeEnhancer = createStore => (baseReducer, initialState = {}) => {
		const reducer = enhanceReducer(handlers.integrityCheck, baseReducer);

		const store = createStore(reducer, initialState);

		startupDistrubute(store)(handlers);

		return R.evolve({
			dispatch: wrapDispatch(handlers),
		})(store);
	};

	return storeEnhancer;
};

export default createStoreEnhancer;
