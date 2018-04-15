import localForage from "localforage";

export const getServerDetails = () =>
	Promise.all([
		localForage.getItem("serverKey"),
		localForage.getItem("serverAddress"),
	]).then(([ key, address, ]) => ({
		key,
		address,
	}));

export const setServerDetails = ({ key, address, }) =>
	Promise.all([
		localForage.setItem("serverKey", key),
		localForage.setItem("serverAddress", address),
	]);
