import startupDistrubute from "./startupDistrubute";
import enhanceReducer from "./enhanceReducer";

const createStoreEnhancer = handlers => {
	const storeEnhancer = createStore => (baseReducer, initialState = {}) => {
		const reducer = enhanceReducer(handlers.integrityCheck, baseReducer);

		const store = createStore(reducer, initialState);

		startupDistrubute(store)(handlers);

		return store;
	};

	return storeEnhancer;
};

export default createStoreEnhancer;
