const getSalt = () => "salt";

const createMiddleware = ({ listenToActions, }) => store => next => action => {
	const actionWithTimeAndSalt = {
		timestamp: new Date().toISOString(),
		salt: getSalt(),
		...action,
	};

	next(actionWithTimeAndSalt);
};

export default createMiddleware;
