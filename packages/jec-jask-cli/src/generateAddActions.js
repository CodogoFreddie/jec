// @flow
import * as R from "ramda";
import type { ID, JecJaskTypes, } from "jec-jask"

import type { DataInterfaceTypes, } from "./parseCli";

type GenerateAddActionsType = (filteredUUIDs: Array<ID>, modifications: Array<DataInterfaceTypes> ) => JecJaskTypes

const generateAddActions: GenerateAddActionsType = (filteredUUIDs, modifications) => {

}

export default generateAddActions;
