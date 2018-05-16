import * as R from "ramda";
import styled from "styled-components";
import React from "react";
import { Box } from "rebass";

import theme from "../theme";

const Square = Box.extend`
	height: 32px;
	width: 32px;
`;

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	grid-gap: 8px;
`;

const Pallete = () => (
	<Grid>
		{R.keys(theme.colors).map(color => <Square key={color} bg={color} />)}
	</Grid>
);

export default Pallete;
