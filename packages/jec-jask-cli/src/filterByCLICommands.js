import * as R from "ramda";

const handlePlusTagFilter = [
	R.prop("plusTag"),
	({ plusTag }) => ({ tags }) => (tags || []).includes(plusTag),
];

const handleProjectFilter = [
	R.propEq("prop", "project"),
	({ value }) => ({ project }) => (project || "").includes(value),
];

const defaultPropValueFilter = [
	R.T,
	({ prop, value }) => task => task[prop] === value,
];

const handlePropValueFilter = [
	R.both(R.prop("prop"), R.prop("value")),
	R.cond([handleProjectFilter, defaultPropValueFilter]),
];

const handleIdFilter = [R.prop("int"), ({ int }) => ({ id }) => int === id];

const filterByCLICommands = R.pipe(
	R.map(R.cond([handlePlusTagFilter, handlePropValueFilter, handleIdFilter])),

	R.filter(Boolean),

	R.when(R.propEq("length", 0), R.always([R.T])),

	R.anyPass,
);

export default filterByCLICommands;
