import chrono from "chrono-node";
import * as R from "ramda";
import {
	addDays,
	addMonths,
	addWeeks,
	addYears,
	endOfDay,
	endOfMonth,
	endOfWeek,
	endOfYear,
	startOfDay,
	startOfMonth,
	startOfWeek,
	startOfYear,
} from "date-fns";

const extractNumber = (adder, ref) =>
	R.pipe(R.match(/\d+/), R.head, x => parseInt(x, 10), x => adder(ref, x));

export const parseDuration = duration => ref =>
	R.cond([
		[R.test(/\d+d/), extractNumber(addDays, ref),],
		[R.test(/\d+w/), extractNumber(addWeeks, ref),],
		[R.test(/\d+m/), extractNumber(addMonths, ref),],
		[R.test(/\d+y/), extractNumber(addYears, ref),],
		[R.test(/\d+day/), extractNumber(addDays, ref),],
		[R.test(/\d+week/), extractNumber(addWeeks, ref),],
		[R.test(/\d+month/), extractNumber(addMonths, ref),],
		[R.test(/\d+year/), extractNumber(addYears, ref),],
		[R.test(/\d+daily/), extractNumber(addDays, ref),],
		[R.test(/\d+weekly/), extractNumber(addWeeks, ref),],
		[R.test(/\d+monthly/), extractNumber(addMonths, ref),],
		[R.test(/\d+yearly/), extractNumber(addYears, ref),],
		[R.test(/^eod$/), () => endOfDay(ref),],
		[R.test(/^eom$/), () => endOfMonth(ref),],
		[R.test(/^eow$/), () => endOfWeek(ref),],
		[R.test(/^eoy$/), () => endOfYear(ref),],
		[R.test(/^sod$/), () => startOfDay(ref),],
		[R.test(/^som$/), () => startOfMonth(ref),],
		[R.test(/^sow$/), () => startOfWeek(ref),],
		[R.test(/^soy$/), () => startOfYear(ref),],
		[R.test(/^now$/), () => ref,],
		[R.T, chrono.parseDate,],
	])(duration);

export const parseDate = date => parseDuration(date)(new Date());
