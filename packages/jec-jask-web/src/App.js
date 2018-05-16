import React from "react";
import { Provider } from "rebass";
import "react-virtualized/styles.css";

import Login from "./components/Login";
import DataProvider from "./components/DataProvider";
import { getServerDetails } from "./services/serverDetails";

class App extends React.Component {
	state = {
		loading: true,
	};

	componentWillMount() {
		getServerDetails().then(({ authKey, address }) =>
			this.setState({
				authKey,
				address,
				loading: false,
			}),
		);
	}

	render() {
		const { loading, authKey, address } = this.state;

		console.log(this.state);
		return (
			<Provider>
				{loading ? (
					<div />
				) : authKey && address ? (
					<DataProvider {...this.state} />
				) : (
					<Login />
				)}
			</Provider>
		);
	}
}

export default App;
