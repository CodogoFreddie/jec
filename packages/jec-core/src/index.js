import hyperdb from "hyperdb"
import uuid from "uuid/v4";
import * as R from "ramda";

import onPeerJoined from "./onPeerJoined";
import joinSwarm from "./joinSwarm";

import onRootReady from "./onRootReady";

class Jec {
	constructor(storage, rootKey){
		this.rootKey = rootKey;
		this.listener = () => {};
		this.state = { };

		if(!this.rootKey){
			this.rootKey = uuid();
		}

		this.dbRoot = hyperdb(storage, this.rootKey);

		this.dbRoot.on("ready", () => {
			this.dbRoot.watch("/", (...args) => {
				console.log(args);
				//this.dbRoot.get("/name", (err, nodes) => {
					//nodes.forEach( (node, i) => {
						//console.log(i, node.value.toString("utf8"))
					//})
				//})
			})

			console.log("ready");
			this.dbRoot.put("/name", "this is my name", () => {
				this.dbRoot.put("/name", "this is my quest", () => {
					this.dbRoot.get("/name", (err, nodes) => {
						nodes.forEach( (node, i) => {
							console.log(i, node.value.toString("utf8"))
						})
					})
				})
			})
		});
	}

	//setState({ config, data, }){
	//if(config){
	//this.state = R.merge(
	//this.state,
	//{ config }
	//);
	//}

	//this.listener(this.state);
	//}

	//createNewWorkspace(){
	//console.log(`creating new workspace`);
	//this.hm.create();
	//}

	onUpdate(listener){
		this.listener = listener;
	}
}

export default Jec;
