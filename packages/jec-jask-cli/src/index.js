// @flow
import createJecJaskStore from "jec-jask"
import type { CreateJecJaskStore, Store, State, Action, } from "jec-jask"

import parseCli from "./parseCli";
import type { DataInterfaceTypes, } from "./parseCli";
import generateAddActions from "./generateAddActions";

const store : Store = createJecJaskStore()

type TempActionGeneratorType = (State, filteredUUIDs: Array<string>, modifications: Array<DataInterfaceTypes> ) => Action
const noop: TempActionGeneratorType = (_, __, ___) => {};

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

			const actionGenerator = generateAddActions

			const filteredUUIDs = [];

			if(modifications){
				const actions : Array<Action>= actionGenerator(store.getState(), filteredUUIDs, modifications);

				actions.map(store.dispatch)

				console.log(store.getState())
			}
		}
	}
})

