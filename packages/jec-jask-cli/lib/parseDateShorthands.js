import chrono from "chrono-node";
import * as R from "ramda";
import { addDays, addMonths, addWeeks, addYears, endOfDay, endOfMonth, endOfWeek, endOfYear, startOfDay, startOfMonth, startOfWeek, startOfYear } from "date-fns";

var extractNumber = function extractNumber(adder, ref) {
	return R.pipe(R.match(/\d+/), R.head, function (x) {
		return parseInt(x, 10);
	}, function (x) {
		return adder(ref, x);
	});
};

export var parseDuration = function parseDuration(duration) {
	return function (ref) {
		return R.cond([[R.test(/\d+d/), extractNumber(addDays, ref)], [R.test(/\d+w/), extractNumber(addWeeks, ref)], [R.test(/\d+m/), extractNumber(addMonths, ref)], [R.test(/\d+y/), extractNumber(addYears, ref)], [R.test(/\d+day/), extractNumber(addDays, ref)], [R.test(/\d+week/), extractNumber(addWeeks, ref)], [R.test(/\d+month/), extractNumber(addMonths, ref)], [R.test(/\d+year/), extractNumber(addYears, ref)], [R.test(/\d+daily/), extractNumber(addDays, ref)], [R.test(/\d+weekly/), extractNumber(addWeeks, ref)], [R.test(/\d+monthly/), extractNumber(addMonths, ref)], [R.test(/\d+yearly/), extractNumber(addYears, ref)], [R.test(/^eod$/), function () {
			return endOfDay(ref);
		}], [R.test(/^eom$/), function () {
			return endOfMonth(ref);
		}], [R.test(/^eow$/), function () {
			return endOfWeek(ref);
		}], [R.test(/^eoy$/), function () {
			return endOfYear(ref);
		}], [R.test(/^sod$/), function () {
			return startOfDay(ref);
		}], [R.test(/^som$/), function () {
			return startOfMonth(ref);
		}], [R.test(/^sow$/), function () {
			return startOfWeek(ref);
		}], [R.test(/^soy$/), function () {
			return startOfYear(ref);
		}], [R.test(/^now$/), function () {
			return ref;
		}], [R.T, chrono.parseDate]])(duration);
	};
};

export var parseDate = function parseDate(date) {
	return parseDuration(date)(new Date());
};

var putVariableRecurenceIntoStructure = function putVariableRecurenceIntoStructure(op) {
	return R.pipe(R.match(/\d+/), R.head, function (x) {
		return parseInt(x, 10);
	}, function (n) {
		return { op: op, n: n };
	});
};

export var parseRecur = R.cond([[R.test(/\d+d/), putVariableRecurenceIntoStructure("addDays")], [R.test(/\d+w/), putVariableRecurenceIntoStructure("addWeeks")], [R.test(/\d+m/), putVariableRecurenceIntoStructure("addMonths")], [R.test(/\d+y/), putVariableRecurenceIntoStructure("addYears")], [R.test(/^eod$/), R.always({
	op: "endOfDay"
})], [R.test(/^eom$/), R.always({
	op: "endOfMonth"
})], [R.test(/^eow$/), R.always({
	op: "endOfWeek"
})], [R.test(/^eoy$/), R.always({
	op: "endOfYear"
})], [R.test(/^sod$/), R.always({
	op: "startOfDay"
})], [R.test(/^som$/), R.always({
	op: "startOfMonth"
})], [R.test(/^sow$/), R.always({
	op: "startOfWeek"
})], [R.test(/^soy$/), R.always({
	op: "startOfYear"
})]]);