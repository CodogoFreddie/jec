import { Button, Header, Image, Input, Modal, } from "semantic-ui-react";

import { getServerDetails, setServerDetails, } from "./serverDetails";

class Login extends React.Component {
	state = {
		key: "",
		address: "",
	};

	componentWillMount() {
		getServerDetails().then(({ key, address, }) =>
			this.setState({
				key,
				address,
			}),
		);
	}

	onChangeKey = ({ target: { value, }, }) =>
		this.setState({
			key: value,
		});

	onChangeAddress = ({ target: { value, }, }) =>
		this.setState({
			address: value,
		});

	onClick = () => {
		console.log("onClick");

		setServerDetails(this.state)
			.then(console.log("wew, lad"))
			.then(() => window.location.reload());
	};

	render() {
		console.log(this.state);

		return (
			<Modal open defaultOpen>
				<Modal.Header>Enter HTTP Server Details</Modal.Header>
				Key
				<Input
					placeholder = "auth key"
					onChange = { this.onChangeKey }
					value = { this.state.key }
				/>
				<br />
				Address
				<Input
					placeholder = "https://foobar.com:8080"
					onChange = { this.onChangeAddress }
					value = { this.state.address }
				/>
				<Modal.Actions>
					<Button color = "green" onClick = { this.onClick }>
						Done
					</Button>
				</Modal.Actions>
			</Modal>
		);
	}
}

export default Login;
