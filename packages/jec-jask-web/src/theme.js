import * as R from "ramda";
import {
	hsl,
	shade,
	tint,
	lighten,
	saturate,
	desaturate,
	darken,
	adjustHue,
} from "polished";

const rotateSixth = adjustHue(60);

const lowlight = x => R.pipe(darken(x), saturate(x / 2));
const highlight = x => R.pipe(lighten(x), desaturate(x / 2));

const red = hsl(0, 0.8, 0.6);
const yellow = rotateSixth(red);
const green = rotateSixth(yellow);
const cyan = rotateSixth(green);
const blue = rotateSixth(cyan);
const purple = rotateSixth(blue);

const pallete = {
	red,
	yellow,
	green,
	cyan,
	blue,
	purple,
};

const alter = (label, fn) =>
	R.pipe(
		R.toPairs,
		R.map(([name, col]) => [name + label, fn(col)]),
		R.fromPairs,
	);

const colors = {
	...alter("Light", highlight(0.2))(pallete),
	...pallete,
	...alter("Dark", lowlight(0.35))(pallete),
	black: shade(0.2, blue),
	white: tint(0.03, blue),
};

export default {
	colors,
};
