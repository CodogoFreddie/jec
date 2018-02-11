import { BrowserRouter as Router, } from "react-router-dom";

import ServerDetails from "./components/serverDetails";
import JecProvider from "./components/jecProvider";
import AllTasks from "./components/allTasks";

export default class App extends React.Component {
	render() {
		const { serverPort, serverAddress, serverKey, } = localStorage;

		return (
			<Router>
				<div>
					<div> jask </div>
					{serverPort && serverAddress && serverKey ? (
						<JecProvider
							port = { serverPort }
							address = { serverAddress }
							authKey = { serverKey }
						>
							{({ stateArr, getConfig, }) => (
								<AllTasks
									tasks = { stateArr }
									config = { getConfig() }
								/>
							)}
						</JecProvider>
					) : (
						<ServerDetails />
					)}
				</div>
			</Router>
		);
	}
}
