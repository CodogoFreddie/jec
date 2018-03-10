function onDocumentReady(docId, doc){
	if(!this.rootKey){
		console.log(`jec root store created: "${docId}"`);
		this.rootKey = docId;

		this.setState({
			config: doc,
		});

		this.createNewWorkspace();

		return;
	}

	if(docId === this.rootKey){
		console.log(`root store is up to date`);
		this.setState({
			config: doc,
		});
		return;
	}

	if(!this.state.data[docId]){
		console.log(`new workspace intalised: "${docId}"`);

		return this.setState({
			config: {
				workspaces: {
					[docId]: true,
				},
			},
			data: {
				[docId]: doc
			}
		});
	}

	console.log(`workspace downloaded: "${docId}"`);
	return this.setState({
		data: {
			[docId]: doc
		}
	});
}

export default onDocumentReady;
