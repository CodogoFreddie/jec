// @flow
import * as R from "ramda";
import type { ID, JecJaskActionTypes, } from "jec-jask"

import type { DataInterfaceTypes, } from "./parseCli";

type GenerateAddActionsType = (filteredUUIDs: Array<ID>, modifications: Array<DataInterfaceTypes> ) => JecJaskActionTypes

const generateAddActions: GenerateAddActionsType = (filteredUUIDs, modifications) => {

}

export default generateAddActions;
