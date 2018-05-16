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

const red = hsl(0, 0.8, 0.5);
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
	...alter("", highlight(0.25))(pallete),
	...alter("Bright", R.identity)(pallete),
	...alter("Dark", lowlight(0.25))(pallete),
	white: tint(0.03, blue),
	grayLight: hsl(0, 0, 0.66666),
	gray: hsl(0, 0, 0.5),
	grayDark: hsl(0, 0, 0.33333),
	black: shade(0.2, blue),
};

const fonts = {
	sans: "Montserrat, sans-serif",
	mono: "Menlo, monospace",
};

export default {
	colors,
	fonts,
};
