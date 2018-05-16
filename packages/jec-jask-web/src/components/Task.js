import * as R from "ramda";
import React, { Fragment } from "react";
import { formatRelative, toDate } from "date-fns/fp";
import { ellipsis } from "polished";
import {
	Badge,
	Circle as CircleRebass,
	Container,
	Divider,
	Flex,
	Text,
} from "rebass";

import Icon from "./Icon";

const TaskGridContainer = Container.extend``;

const Description = Text.extend`
	${ellipsis("800px")};
`;

const Circle = CircleRebass.extend`
	padding: 0;
	display: inline-flex;
	align-items: center;
	justify-content: center;
`;

const formatDate = R.pipe(toDate, formatRelative(new Date()));

const formatRecur = ({ n, period }) =>
	({
		d: n => `${n} day`,
		w: n => `${n} week`,
		m: n => `${n} month`,
		y: n => `${n} year`,
	}[period](n) + (n > 1 ? "s" : ""));

const TitleCase = R.pipe(
	R.prop("children"),
	R.split(""),
	R.over(R.lensIndex(0), x => x.toUpperCase()),
	R.join(""),
);

const overDue = due => due > new Date().toISOString();

const Task = ({
	description,
	due,
	id,
	project,
	recur,
	score,
	tags,
	uuid,
	wait,
	priority,
	...rest
}) => (
	<Fragment>
		<TaskGridContainer maxWidth={800}>
			<Flex direction="row" justifyContent="space-between">
				<Description fontSize={4} disabled={!!description}>
					<TitleCase>{description || "No Description..."}</TitleCase>
				</Description>
			</Flex>

			<Flex direction="row" alignItems="center">
				<Badge bg="red" color="grayDark" mx={0} mr={1} my={1}>
					{score.toPrecision(3)}
				</Badge>
				{priority && (
					<Circle
						fontWeight="bold"
						color="grayDark"
						bg={
							{
								H: "red",
								M: "yellow",
								L: "cyan",
							}[priority]
						}
					>
						{priority}
					</Circle>
				)}
				{project && (
					<Badge color="grayDark" bg="blue">
						{project}
					</Badge>
				)}
				{tags.map(tag => (
					<Badge color="grayDark" bg="green" key={tag}>
						{tag}
					</Badge>
				))}
			</Flex>

			<Flex alignItems="center">
				<Icon
					color={overDue(due) ? "black" : "redBright"}
					name="Calendar"
					size={16}
					mr={1}
				/>
				<Text color={overDue(due) ? "black" : "redBright"}>
					{formatDate(due)}
				</Text>
				{recur && (
					<Fragment>
						<Icon name="Repeat" size={16} ml={3} mr={1} />
						<Text>{formatRecur(recur)}</Text>
					</Fragment>
				)}
			</Flex>
		</TaskGridContainer>
		<Divider />
	</Fragment>
);

export default Task;
