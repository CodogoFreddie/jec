// @flow
import * as R from "ramda";

export type PlusTagType = {
	plusTag: string,
} 
export type MinusTagType = {
	minusTag: string,
}
export type KeyValueType = {
	key: string,
	value: string,
}
export type PlainType = {
	plain: string,
}
export type DataInterfaceTypes = PlusTagType | MinusTagType | KeyValueType | PlainType

type ParsedArgs = {
	filter?: DataInterfaceTypes,
	command: "add" | "modify" | "delete" | "start" | "stop" | "done",
	modifications?: DataInterfaceTypes,
}

type ParseDataInterfaceType = (args: string) => DataInterfaceTypes
const parseDataInterface : ParseDataInterfaceType = R.cond([
	[
		R.test(/^\+\w+/),
		R.pipe(
			R.replace("+", ""),
			R.objOf("plusTag"),
		),
	],
	[
		R.test(/^-\w+/),
		R.pipe(
			R.replace("-", ""),
			R.objOf("minusTag"),
		),
	],
	[
		R.test(/[\w ]+:[\w ]+/),
		R.pipe(
			R.split(":"),
			([key, value,]) => ({
				key,
				value,
			})
		),
	],
	[
		R.T,
		plain => ({ plain, }),
	],
])

const combinePlains = R.pipe(
	R.reduce(
		({ arr, plain, }, val) => {
			if(val.plain){
				return {
					arr,
					plain: `${plain} ${val.plain}`,
				}
			}
			else {
				return {
					arr: [
						...arr,
						val,
					],
					plain,
				}
			}
		},
		{
			arr: [],
			plain: "",
		}
	),
	({ arr, plain, }) => ([
		...arr,
		plain.length ? { plain, } : null,
	]),
	R.filter(Boolean)
)

const commandStrings = ["add" , "modify" , "delete" , "start" , "stop" , "done", ]

type ParseCliType = (args: Array<string>) => ParsedArgs
const parseCli: ParseCliType = R.pipe(
	R.slice(2, Infinity),
	R.splitWhen(R.contains(R.__, commandStrings)),
	([filter, [command, ...modifications]]) => ({
		filter,
		command,
		modifications,
	}),
	R.evolve({
		filter: R.map(parseDataInterface),
		modifications: R.map(parseDataInterface),
	}),
	R.evolve({
		filter: combinePlains,
		modifications: combinePlains,
	})
)

export default parseCli
