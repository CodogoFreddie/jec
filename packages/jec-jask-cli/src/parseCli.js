import * as R from "ramda";

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
			([prop, value,]) => ({
				prop,
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
					plain: plain.length ? `${plain} ${val.plain}` : val.plain,
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
		plain.length ? { prop: "description", value: plain, } : null,
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
