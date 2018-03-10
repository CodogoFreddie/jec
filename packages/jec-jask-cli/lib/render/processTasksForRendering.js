import _typeof from "babel-runtime/helpers/typeof";
import _objectWithoutProperties from "babel-runtime/helpers/objectWithoutProperties";
import R from "ramda";
import { toDate, formatDistanceStrictWithOptions } from "date-fns/fp";

var map = R.addIndex(R.map);

var sigFig = function sigFig(sf) {
	return function (x) {
		return parseFloat(x.toPrecision(sf), 10);
	};
};

var filterTasks = R.filter(function (_ref) {
	var due = _ref.due,
	    done = _ref.done;
	return !done || due > done;
});

var addRenderingMetaToTasks = function addRenderingMetaToTasks() {
	var giveScore = R.pipe(function (_ref2) {
		var due = _ref2.due,
		    priority = _ref2.priority;

		var now = new Date().getTime();
		var dueTime = new Date(due).getTime();
		//const createdTime = new Date(created).getTime();
		//const updatedTime = new Date(updated).getTime();

		return (due ? Math.pow(10, (now - dueTime) / 4320000000 + 1) : 0) + (
		//( start > ( stop || 0 ) ? 50 : 0 )
		//+
		//( Math.pow(10, ( now - created ) / 22896000000 ) )
		//+
		//( Math.pow(10, ( now - updated ) / 22896000000 )  )
		//+
		priority ? { H: 10, M: 5, L: -2 }[priority] || 0 : 0);
	}, sigFig(3));
	return map(function (task, i) {
		return Object.assign({}, task, {
			i: i,
			score: giveScore(task),
			color: []
		});
	});
};

var formatDateDistance = R.pipe(toDate, formatDistanceStrictWithOptions({
	addSuffix: true
})(new Date()));

var addPlusToTags = R.pipe(R.map(function (x) {
	return "+" + x;
}), R.join(" "));

var stringfiyTasksFields = function stringfiyTasksFields(tasks) {
	return R.map(R.pipe(R.evolve({
		created: formatDateDistance,
		done: formatDateDistance,
		due: formatDateDistance,
		tags: addPlusToTags,
		updated: formatDateDistance,
		wait: formatDateDistance,
		depends: function depends(uuid) {
			return "" + R.findIndex(R.propEq("uuid", uuid), tasks);
		}
	}), function (_ref3) {
		var i = _ref3.i,
		    color = _ref3.color,
		    score = _ref3.score,
		    rest = _objectWithoutProperties(_ref3, ["i", "color", "score"]);

		return Object.assign({
			i: i,
			color: color,
			score: score
		}, R.map(function (x) {
			return (typeof x === "undefined" ? "undefined" : _typeof(x)) === "object" ? JSON.stringify(x) : "" + x;
		}, rest));
	}))(tasks);
};

export default (function (_ref4) {
	var height = _ref4.height;
	return R.pipe(filterTasks, R.slice(0, height - 4), addRenderingMetaToTasks(), stringfiyTasksFields, R.sortBy(R.prop("score")), R.reverse);
});