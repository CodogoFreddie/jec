import fetchConfig from "jec-config-fetcher";

fetchConfig(console.log).then( config => {
	console.log({ config, });
});
