import localForage from "localforage";

const serverDetailsStorage = localForage.createInstance({
	name: "serverDetails",
});

export const getServerDetails = () =>
	Promise.all([
		serverDetailsStorage.getItem("serverauthKey"),
		serverDetailsStorage.getItem("serverAddress"),
	]).then(([authKey, address]) => ({
		authKey,
		address,
	}));

export const setServerDetails = ({ authKey, address }) =>
	Promise.all([
		serverDetailsStorage.setItem("serverauthKey", authKey),
		serverDetailsStorage.setItem("serverAddress", address),
	]);
