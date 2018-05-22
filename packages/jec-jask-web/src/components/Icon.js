import React from "react";
import { Text } from "rebass";
import Calendar from "react-feather/dist/icons/calendar";
import Repeat from "react-feather/dist/icons/repeat";

const Feather = { Calendar, Repeat };

const Icon = ({ name, size, ...props }) => {
	const SpecificIcon = Feather[name];

	return (
		<Text {...props}>
			<SpecificIcon size={size} />{" "}
		</Text>
	);
};

export default Icon;
