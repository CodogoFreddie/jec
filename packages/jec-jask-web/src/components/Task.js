import * as R from "ramda";
import React, { Fragment } from "react";
import formatRelative from "date-fns/fp/formatRelative";
import toDate from "date-fns/fp/toDate";
import { ellipsis } from "polished";
import {
	Badge,
	Circle as CircleRebass,
	Container,
	Divider,
	Flex,
	Text,
	Truncate,
} from "rebass";

import Icon from "./Icon";

const TaskGridContainer = Container.extend`
	transition: all 0.5s;
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

const Noop = ({ children }) => children;

class Task extends React.Component {
	state = {
		expanded: false,
	};

	toggleExpanded = () => {
		this.setState(({ expanded }) => ({ expanded: !expanded }));
	};

	render() {
		const {
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
		} = this.props;

		const ConditionalTruncate = this.state.expanded ? Text : Truncate;
		return (
			<Fragment>
				<TaskGridContainer maxWidth={800} onClick={this.toggleExpanded}>
					<Flex direction="row" justifyContent="space-between">
						<ConditionalTruncate
							fontSize={4}
							disabled={!!description}
						>
							<TitleCase>
								{description || "No Description..."}
							</TitleCase>
						</ConditionalTruncate>
					</Flex>

					<Flex direction="row" alignItems="center" ml={-1}>
						<Badge bg="red" color="grayDark">
							{score.toPrecision(3)}
						</Badge>
						{priority && (
							<Icon
								name={
									{
										H: "ChevronsUp",
										M: "ChevronUp",
										L: "ChevronDown",
									}[priority]
								}
								color={
									{
										H: "redBright",
										M: "yellowBright",
										L: "cyanBright",
									}[priority]
								}
							/>
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
	}
}

export default Task;
