function onDocumentUpdated(docId, doc){
	console.log("onDocumentUpdated", docId)
	if(docId === this.rootKey){
		this.setState({
			config: doc,
		});
	} else {
		this.setState({
			data: {
				[docId]: doc,
			}
		})
	}
}

export default onDocumentUpdated;
