import R from "ramda";
import { toDate, formatDistanceStrictWithOptions, } from "date-fns/fp";

const map = R.addIndex(R.map);

const sigFig = sf => x => parseFloat(x.toPrecision(sf), 10);

const filterTasks = config => R.filter( ({ due, done, }) => (
	!done 
	||
	due > done
));

const addRenderingMetaToTasks = config => {
	const giveScore = R.pipe(
		({ uuid, due, start, stop, created, updated, done, tags, project, priority, }) => {
			const now = new Date().getTime();
			const dueTime = new Date(due).getTime();
			const createdTime = new Date(created).getTime();
			const updatedTime = new Date(updated).getTime();

			return (
				( due ? Math.pow(10, ( ( now - dueTime ) / 4320000000 ) + 1) : 0 )
				+
				//( start > ( stop || 0 ) ? 50 : 0 )
				//+
				//( Math.pow(10, ( now - created ) / 22896000000 ) )
				//+
				//( Math.pow(10, ( now - updated ) / 22896000000 )  )
				//+
				( priority ? ( ({ H: 10, M: 5, L: -2 })[priority] || 0 ) : 0 )
			)
		},
		sigFig(3),
	);
	return map((task, i) => ({
		...task,
		i,
		score: giveScore(task),
		color: [],
	}));
};

const formatDateDistance = R.pipe(
	toDate,
	formatDistanceStrictWithOptions({
		addSuffix: true,
	})(new Date()),
);

const addPlusToTags = R.pipe(R.map(x => `+${x}`), R.join(" "));

const stringfiyTasksFields = tasks =>
	R.map(
		R.pipe(
			R.evolve({
				created: formatDateDistance,
				done: formatDateDistance,
				due: formatDateDistance,
				tags: addPlusToTags,
				updated: formatDateDistance,
				wait: formatDateDistance,
				depends: uuid =>
				"" + R.findIndex(R.propEq("uuid", uuid), tasks),
			}),
			({ i, color, score, ...rest }) => ({
				i,
				color,
				score,
				...R.map( x => (typeof x === "object") ? JSON.stringify(x) : "" + x, rest),
			}),
		),
	)(tasks);

export default ({ config, height, }) =>
	R.pipe(
		R.toPairs,
		R.map( ([ uuid, rest, ]) => ({
			uuid,
			...rest,
		})),
		filterTasks(config),
		R.slice(0, height - 4),
		addRenderingMetaToTasks(config),
		stringfiyTasksFields,
		R.sortBy(R.prop("score")),
		R.reverse,
	);
