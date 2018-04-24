const getSalt = () =>
	Math.random()
		.toString(36)
		.replace(/[^a-z]+/g, "")
		.substr(0, 4);

const createMiddleware = ({ listenToActions }) => store => next => action => {
	const actionWithTimeAndSalt = {
		timestamp: new Date().toISOString(),
		salt: getSalt(),
		...action,
	};

	next(actionWithTimeAndSalt);
};

export default createMiddleware;
