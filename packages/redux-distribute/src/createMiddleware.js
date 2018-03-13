const getSalt = () => "salt";

const createMiddleware = ({
	listenToActions,
}) => store => next => action => {
	const actionWithTimeAndSalt = {
		...action,
		timeStamp: new Date().getISOTime(),
		salt: getSalt(),
	}

	next(actionWithTimeAndSalt);
}

export default createMiddleware
