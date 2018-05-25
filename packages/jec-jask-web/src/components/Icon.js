import React from "react";
import { Text } from "rebass";
import Calendar from "react-feather/dist/icons/calendar";
import Repeat from "react-feather/dist/icons/repeat";
import ChevronsUp from "react-feather/dist/icons/chevrons-up";
import ChevronUp from "react-feather/dist/icons/chevron-up";
import ChevronDown from "react-feather/dist/icons/chevron-down";

const Feather = { Calendar, Repeat, ChevronDown, ChevronUp, ChevronsUp };

const Icon = ({ name, size, ...props }) => {
	const SpecificIcon = Feather[name];

	return (
		<Text {...props}>
			<SpecificIcon size={size} />{" "}
		</Text>
	);
};

export default Icon;
