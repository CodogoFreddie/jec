export const idFromAction = action =>
	`${action.timestamp}_${action.type}_${action.salt}`;
