import createJecJaskStore, { collateAllObjects } from "jec-jask";
import { Provider } from "react-redux";
import storage from "redux-persist/lib/storage";
import localForage from "localforage";

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
			const cached = await localForage.getItem(`action::${id}`)

			if(cached){
				return cached
			}

			const resp = await fetch(address + "/" + id, {
				headers: {
					Authorization: authKey,
				},
			});

			const action = await resp.json();

			localForage.setItem(`action::${id}`, action)

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
