import {
	setPersistHandlers,
	initalise,
	getState,
	getStateArr,
	getConfig,
	insertAction as insertActionToEngine,
	insertActions as insertActionsToEngine,
} from "jec-engine";

export default class JecProvider extends React.Component {
	constructor(props) {
		super(props);

		console.log(this.props);

		setPersistHandlers({
			listActions: () =>
				fetch(`http://${this.props.address}:${this.props.port}`, {
					headers: {
						Authorization: this.props.authKey,
					},
				}).then(x => x.json()),

			readAction: key =>
				Promise.resolve(localStorage[`jecAction_${key}`]).then(
					cachedAction =>
						cachedAction
							? JSON.parse(cachedAction)
							: fetch(
								`http://${this.props.address}:${
									this.props.port
								}/${key}`,
								{
									headers: {
										Authorization: this.props.authKey,
									},
								},
							)
								.then(x => x.json())
								.then(
									R.tap(
										action =>
											(localStorage[
												`jecAction_${key}`
											] = JSON.stringify(action)),
									),
								),
				),

			writeAction: action => console.warn("stubbed write action", action),
		});

		initalise().then(() =>
			this.setState({
				jecState: getState(),
				jecStateArr: getStateArr(),
			}),
		);

		this.state = {
			jecState: {},
			jecStateArr: [],
		};

		this.insertAction = this.insertAction.bind(this);
	}

	insertAction(action) {
		insertActionToEngine(action).then(() =>
			this.setState(({ unSavedActions, ...rest }) => ({
				...rest,
				jecState: getState(),
				jecStateArr: getStateArr(),
				unSavedActions: unSavedActions - 1,
			})),
		);

		this.setState(({ unSavedActions, ...rest }) => ({
			...rest,
			jecState: getState(),
			jecStateArr: getStateArr(),
			unSavedActions: unSavedActions + 1,
		}));
	}

	render() {
		console.log(this.state);
		return this.props.children({
			state: this.state.jecState,
			stateArr: this.state.jecStateArr,
			getConfig,
			unSavedActions: !!this.state.unSavedActions,
			insertAction: this.insertAction,
		});
	}
}
