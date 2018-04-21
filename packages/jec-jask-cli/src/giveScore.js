import * as R from "ramda";

const giveScore = R.pipe(
	R.converge(
		(...scores) =>
			R.pipe(
				R.filter(Boolean),
				R.filter(x => typeof x === "number"),
				R.sum,
			)(scores),
		[
			({ due, }) =>
				(new Date(due).getTime() - new Date().getTime()) / 86400000,
			({ tags, }) => tags.length,
			({ project, }) => (project ? 3 : 0),
			({ start, }) => (start ? 5 : 0),
			({ priority, }) =>
				({
					H: 10,
					M: 5,
					L: 2,
				}[priority]),
		],
	),
);

export default giveScore;
