function onPeerJoined(_, peer){ 
	const peerId = escape(peer.id.toString("ascii"));

	this.setState({
		network: {
			[peerId]: true,
		}
	});
}

export default onPeerJoined;
