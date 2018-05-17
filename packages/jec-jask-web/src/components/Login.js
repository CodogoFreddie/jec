import React from "react";
import { Label, Divider, Modal, Heading, Button, Input } from "rebass";

import { getServerDetails, setServerDetails } from "../services/serverDetails";

class Login extends React.Component {
	state = {
		authKey: "",
		address: "",
	};

	componentWillMount() {
		getServerDetails().then(({ authKey, address }) =>
			this.setState({
				authKey,
				address,
			}),
		);
	}

	onChangeauthKey = ({ target: { value } }) =>
		this.setState({
			authKey: value,
		});

	onChangeAddress = ({ target: { value } }) =>
		this.setState({
			address: value,
		});

	onClick = () => {
		setServerDetails(this.state).then(() => window.location.reload()).catch( e => window.alert(e.toString()));
	};

	render() {
		return (
			<Modal>
				<Heading>Enter HTTP Server Details</Heading>
				<Divider />
				<Label>Key</Label>
				<Input
					placeholder="auth key"
					onChange={this.onChangeauthKey}
					value={this.state.authKey}
				/>
				<Label>Address</Label>
				<Input
					placeholder="https://foobar.com:8080"
					onChange={this.onChangeAddress}
					value={this.state.address}
				/>
				<Divider />
				<Button bg="green" onClick={this.onClick}>
					Done
				</Button>
			</Modal>
		);
	}
}

export default Login;
