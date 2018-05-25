import * as R from "ramda";
import React from "react";
import { collateAllObjects } from "jec-jask";
import { connect } from "react-redux";
import toDate from "date-fns/fp/toDate";
import startOfDay from "date-fns/fp/startOfDay";
import format from "date-fns/fp/format";
import {
	Box,
	Divider,
	Fixed,
	Flex,
	Heading,
	Modal,
	Pre,
	Progress,
	Toolbar,
} from "rebass";
import packageJSON from "../../package.json";

import Task from "./Task";

const ListContainerContainer = Flex.extend`
	flex-direction: column;
	align-items: stretch;
	justify-content: stretch;
	height: 100vh;
`;

const formatActionTimestamp = format("YYYY-MM-dd hh:mm:ss aaaa");
const actionTimestampDayProgress = date => {
	return (date.getTime() - startOfDay(date).getTime()) / 86400000;
};

@connect(R.identity)
class Tasks extends React.Component {
	render() {
		const tasks =
			//this.props.distributeStatus === "UP_TO_DATE"
			//?
			R.sortBy(({ score }) => -score, collateAllObjects(this.props));
		//: [];

		const currentActionTime = R.pipe(
			R.pathOr("", ["actionChain", 0, "id"]),
			R.split("_"),
			R.nth(0),
			toDate,
		)(this.props);

		return (
			<React.Fragment>
				{this.props.distributeStatus !== "UP_TO_DATE" && (
					<Modal>
						<Heading textAlign="center">Loading Actions</Heading>
						<Divider />
						<Pre>{formatActionTimestamp(currentActionTime)}</Pre>
						<Progress
							value={actionTimestampDayProgress(
								currentActionTime,
							)}
						/>
					</Modal>
				)}
				<ListContainerContainer>
					<Box flex="0 0 64px" />

					<Box flex={1}>
						{tasks.map(task => <Task key={task.uuid} {...task} />)}
					</Box>
				</ListContainerContainer>

				<Fixed top={0} left={0} right={0}>
					<Toolbar bg="black">
						<Flex direction="row" width="100%">
							<Box flex={1}>jec::jask::web</Box>
							<Box>{packageJSON.version}</Box>
							<Box>{process.env.BRANCH}</Box>
						</Flex>
					</Toolbar>
				</Fixed>
			</React.Fragment>
		);
	}
}

export default Tasks;
