import createJecJaskStore, { collateAllObjects } from "jec-jask";
import { Provider } from "react-redux";
import storage from "redux-persist/lib/storage";

import Routing from "./Routing";

class DataProvider extends React.Component {
	constructor(props) {
		super(props);

		const { authKey, address } = props;

		async function* listAllActions() {
			const resp = await fetch(address, {
				headers: {
					Authorization: authKey,
				},
			});

			const ids = await resp.json();
			for await (const id of ids) {
				yield id;
			}
		}

		const writeAction = console.log;

		const readAction = async id => {
			const resp = await fetch(address + "/" + id, {
				headers: {
					Authorization: authKey,
				},
			});

			const action = await resp.json();

			return action;
		};

		this.store = createJecJaskStore({
			listAllActions,
			writeAction,
			readAction,
			persistStorage: storage,
		});
	}

	render() {
		return (
			<Provider store={this.store}>
				<Routing />
			</Provider>
		);
	}
}

export default DataProvider;
