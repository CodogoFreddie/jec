import * as R from "ramda";
import React from "react";
import { Label, Divider, Modal, Heading, Button, Input } from "rebass";

import { getServerDetails, setServerDetails } from "./serverDetails";

class Login extends React.Component {
	state = {
		key: "",
		address: "",
	};

	componentWillMount() {
		getServerDetails().then(({ key, address }) =>
			this.setState({
				key,
				address,
			}),
		);
	}

	onChangeKey = ({ target: { value } }) =>
		this.setState({
			key: value,
		});

	onChangeAddress = ({ target: { value } }) =>
		this.setState({
			address: value,
		});

	onClick = () => {
		setServerDetails(this.state).then(() => window.location.reload());
	};

	render() {
		return (
			<Modal>
				<Heading>Enter HTTP Server Details</Heading>
				<Divider />
				<Label>Key</Label>
				<Input
					placeholder="auth key"
					onChange={this.onChangeKey}
					value={this.state.key}
				/>
				<Label>Address</Label>
				<Input
					placeholder="https://foobar.com:8080"
					onChange={this.onChangeAddress}
					value={this.state.address}
				/>
				<Divider />
				<Button color="green" onClick={this.onClick}>
					Done
				</Button>
			</Modal>
		);
	}
}

export default Login;
