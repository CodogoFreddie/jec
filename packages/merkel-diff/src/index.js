import * as R from "ramda";
import crypto from "crypto";

const hash = x =>
	crypto
		.createHash("sha256")
		.update(JSON.stringify(x))
		.digest("base64");

const merkel = (arr, length) => {
	if (Math.round(Math.log2(arr.length)) !== Math.log2(arr.length)) {
		return merkel(
			arr.concat(
				R.repeat(
					"_",
					Math.pow(2, Math.ceil(Math.log2(arr.length))) - arr.length,
				),
			),
			arr.length,
		);
	}

	const recursive = arr => {
		if (arr.length === 1) {
			return hash(arr[0]);
		}

		const [left, right] = R.splitAt(arr.length / 2, arr).map(recursive);

		return hash(left + right);
	};

	const [left, right] = R.splitAt(arr.length / 2, arr).map(recursive);

	return {
		left,
		root: hash(left + right),
		right,
		length: length || arr.length,
		height: Math.log2(arr.length),
	};
};
