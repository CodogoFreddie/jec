import Login from "./Login";
import DataProvider from "./DataProvider";

import { getServerDetails, } from "./serverDetails";

class App extends React.Component {
	state = {
		loading: true,
	};

	componentWillMount() {
		getServerDetails().then(({ key, address, }) =>
			this.setState({
				key,
				address,
				loading: false,
			}),
		);
	}

	render() {
		const { loading, key, address, } = this.state;

		console.log(this.state);
		return loading ? (
			<div />
		) : key && address ? (
			<DataProvider authKey = { key } address = { address } />
		) : (
			<Login />
		);
	}
}

export default App;