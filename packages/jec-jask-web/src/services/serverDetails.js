import * as R from "ramda";
import React from "react";
import localForage from "localforage";

export const getServerDetails = () =>
	Promise.all([
		localForage.getItem("serverauthKey"),
		localForage.getItem("serverAddress"),
	]).then(([authKey, address]) => ({
		authKey,
		address,
	}));

export const setServerDetails = ({ authKey, address }) =>
	Promise.all([
		localForage.setItem("serverauthKey", authKey),
		localForage.setItem("serverAddress", address),
	]);
