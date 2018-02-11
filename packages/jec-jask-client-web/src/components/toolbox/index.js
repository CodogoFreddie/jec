import { Link, } from "react-router-dom";

import styled from "styled-components";
import system from "system-components";

export const Box = styled.div``;

export const Flex = system({
	flexDirection: "column",
}).extend`
	display: flex;
`;

export const TextInput = ({ label, ...props }) => (
	<Flex direction = "row">
		{label} <input { ...props } />
	</Flex>
);

export const Button = styled.button``;

const CardContainer = system({
	is: Link,
	color: "black",
	borderColor: "black",
	borderRadius: 2,
	borderWidth: 1,
	boxShadow: 1,
	m: 1,
}).extend`
	display: block;
	text-decoration: none;
`;

export const Card = ({ uuid, title, children, }) => (
	<CardContainer to = { uuid }>
		{title}
		<hr />
		{children}
	</CardContainer>
);
