// @flow

import type { Action } from "./reducers";

type $ExtractFunctionReturn = <V>(v: (...args: any) => V) => V;

export type State = $ObjMap<Action, $ExtractFunctionReturn>;
