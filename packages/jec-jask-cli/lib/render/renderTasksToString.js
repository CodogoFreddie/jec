import R from "ramda";
import chalk from "chalk";

var padString = function padString() {
	var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
	var length = arguments[1];
	return string + R.times(R.always(""), length - ("" + string).length + 1).join(" ");
};

var renderRow = function renderRow(_ref) {
	var renderReadyTasks = _ref.renderReadyTasks,
	    columnWidths = _ref.columnWidths;
	return function (row, y) {
		var color = renderReadyTasks[y].color;


		var colors = [].concat(color, [y % 2 ? {
			fn: "bgHex",
			val: "#111"
		} : false]).filter(Boolean);

		return row.map(function (cell, x) {
			return R.reduce(function (string, _ref2) {
				var fn = _ref2.fn,
				    val = _ref2.val;
				return chalk[fn](val)(string);
			}, padString(cell, columnWidths[x].length) + " ", colors);
		}).join("");
	};
};

var blockTableData = function blockTableData(_ref3) {
	var renderReadyTasks = _ref3.renderReadyTasks,
	    columnWidths = _ref3.columnWidths,
	    tabledData = _ref3.tabledData;
	return [columnWidths.map(function (_ref4) {
		var label = _ref4.label,
		    length = _ref4.length;
		return chalk.underline(padString(label, length));
	}).join(" ")].concat(tabledData.map(renderRow({
		renderReadyTasks: renderReadyTasks,
		columnWidths: columnWidths,
		tabledData: tabledData
	}))).join("\n");
};

export default (function (_ref5) {
	var renderReadyTasks = _ref5.renderReadyTasks,
	    columnWidths = _ref5.columnWidths;

	var tabledData = R.pipe(R.map(function (_ref6) {
		var label = _ref6.label;
		return R.pluck(label, renderReadyTasks);
	}), R.transpose)(columnWidths);

	var blockedTable = blockTableData({
		renderReadyTasks: renderReadyTasks,
		columnWidths: columnWidths,
		tabledData: tabledData
	});

	return blockedTable;
});