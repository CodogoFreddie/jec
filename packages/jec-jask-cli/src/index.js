// @flow
import createJecJaskStore from "jec-jask"
import type { ReduxState } from "jec-jask"

import parseCli from "./parseCli";
import generateAddActions from "./generateAddActions";

const store = createJecJaskStore()

type TempActionGeneratorType = (filteredUUIDs: Array<ID>, modifications: Array<DataInterfaceTypes> ) => JecJaskTypes
const noop: TempActionGeneratorType = (_, __) => {};

let hasRunCliCommand = false
store.subscribe( () => {
	if(!hasRunCliCommand){
	const { _persist: { rehydrated, } } = store.getState()

		if(rehydrated){
			hasRunCliCommand = true

			const {
				filter,
				command,
				modifications,
			} = parseCli(process.argv)

			const actionGenerator = ({
				add: generateAddActions,
				delete: noop,
				done: noop,
				modify: noop,
				start: noop,
				stop: noop,
			})[command]

			const filteredUUIDs = [];

			const actions = actionGenerator(filteredUUIDs, modifications);

			console.log(JSON.stringify({
				filter,
				command,
				modifications,
				actions,
			}, null, 2))
		}
	}
})

