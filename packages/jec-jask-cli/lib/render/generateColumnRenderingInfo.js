import R from "ramda";

var measureColumnWidths = function measureColumnWidths(config) {
	return R.reduce(function (columnWidths, task) {
		return Object.assign({}, columnWidths, R.pipe(R.toPairs, R.filter(function (_ref) {
			var key = _ref[0];
			return R.contains(key, config.jask.headers);
		}), R.map(function (_ref2) {
			var key = _ref2[0],
			    value = _ref2[1];
			return [key, Math.max(key.length || 0, value.length || 0, columnWidths[key] || 0, 0)];
		}), R.fromPairs)(task));
	}, {});
};

export default (function (config) {
	return R.pipe(measureColumnWidths(config), R.pipe(R.toPairs, R.map(function (_ref3) {
		var label = _ref3[0],
		    length = _ref3[1];
		return {
			label: label,
			length: length
		};
	}), R.sortBy(function (_ref4) {
		var label = _ref4.label;
		return R.findIndex(R.equals(label), config.jask.headers);
	})));
});