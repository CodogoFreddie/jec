function onPeerLeft(peerId){
	this.setState({
		network: {
			[peerId]: false,
		}
	});
}

export default onPeerLeft;

