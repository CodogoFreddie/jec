import R from "ramda";
import { formatDistanceStrictWithOptions, toDate } from "date-fns/fp";

const map = R.addIndex(R.map);

const sigFig = sf => x => parseFloat(x.toPrecision(sf), 10);

const filterTasks = config => R.filter(config.filterTask);

const addRenderingMetaToTasks = config => {
	const giveColor = config.giveColor;

	return map((task, i) => ({
		...task,
		i,
		score: sigFig(3)(task.score),
		color: giveColor(task),
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
				start: formatDateDistance,
				stop: formatDateDistance,
				tags: addPlusToTags,
				updated: formatDateDistance,
				wait: formatDateDistance,
				depends: uuid =>
					"" + R.findIndex(R.propEq("uuid", uuid), tasks),
				recur: ({ n, period }) =>
					n +
					" " +
					{
						d: "days",
						w: "weeks",
						m: "months",
						y: "years",
					}[period],
			}),
			({ i, color, score, ...rest }) => ({
				i,
				color,
				score,
				...R.map(x => "" + x, rest),
			}),
		),
	)(tasks);

export default ({ config, height }) =>
	R.pipe(
		filterTasks(config),
		addRenderingMetaToTasks(config),
		stringfiyTasksFields,
		R.sortBy(R.prop("score")),
		R.reverse,
		R.slice(0, height - 4),
	);
