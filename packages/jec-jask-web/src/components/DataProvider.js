import React from "react";
import { Provider } from "react-redux";

import Routing from "./Routing";
import store from "../redux";

class DataProvider extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<Routing />
			</Provider>
		);
	}
}

export default DataProvider;
