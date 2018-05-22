import React from "react";
import { Provider } from "rebass";

import Login from "./components/Login";
import DataProvider from "./components/DataProvider";
import { getServerDetails } from "./services/serverDetails";
import theme from "./theme";

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

		return (
			<Provider theme={theme}>
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
