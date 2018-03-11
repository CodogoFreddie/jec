export const scuttlebotActions = {
};

const createReduxScuttlebot = ({
	listenToActionTypes = [],
}) => {

	const scuttlebotReducers = {
		actions: (state = [], action) => {
			if(listenToActionTypes.includes(action.type)){
				return [
					...state,
					action,
				];
			} else {
				return state;
			}
		},
	};

	const scuttlebotMiddleware = store => next => action => {
		if(!listenToActionTypes.includes(action.type)){
			next(action);
			return;
		}
	};

	function* scuttlebotSagas(){

	}

	return {
		scuttlebotMiddleware,
		scuttlebotReducers,
		scuttlebotSagas,
	};
}

export default createReduxScuttlebot;
