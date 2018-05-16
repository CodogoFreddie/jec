import React from "react";
import * as Feather from "react-feather";

import { Text } from "rebass";

const Icon = ({ name, size, ...props }) => {
	const SpecificIcon = Feather[name];

	return (
		<Text {...props}>
			<SpecificIcon size={size} />{" "}
		</Text>
	);
};

export default Icon;
