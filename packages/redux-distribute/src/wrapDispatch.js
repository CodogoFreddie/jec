const getSalt = () =>
	Math.random()
		.toString(36)
		.replace(/[^a-z]+/g, "")
		.substr(0, 4);

const wrapDispatch = handlers => dispatch => action => {
	const newAction = {
		...action,
		timestamp: new Date.toISOString(),
		salt: getSalt(),
	};

	dispatch(newAction);

	handlers.setAction(action);
};
