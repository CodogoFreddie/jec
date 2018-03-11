export const test = (state = "", { type, value, } ) => {
	if(type === "SET_TEST_STATE"){
		return value;
	} else {
		return state;
	}
};
