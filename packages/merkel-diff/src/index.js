import * as R from "ramda";
import crypto from "crypto";

const hash = x =>
	crypto
		.createHash("sha256")
		.update(JSON.stringify(x))
		.digest("base64");

const merkel = arr => {
	if (Math.round(Math.log2(arr.length)) !== Math.log2(arr.length)) {
		return merkel(
			arr.concat(
				R.repeat(
					"_",
					Math.pow(2, Math.ceil(Math.log2(arr.length))) - arr.length,
				),
			),
		);
	}

	const recursive = arr => {
		if (arr.length === 1) {
			return {
				start: arr[0],
				root: hash(arr[0]),
				end: arr[arr.length - 1],
			};
		}

		const [left, right] = R.splitAt(arr.length / 2, arr).map(recursive);

		return {
			start: arr[0],
			left: left.root,
			root: hash(left.root + right.root),
			right: right.root,
			end: arr[arr.length - 1],
		};
	};

	return recursive(arr);
};
