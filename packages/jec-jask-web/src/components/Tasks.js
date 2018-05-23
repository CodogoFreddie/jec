import * as R from "ramda";
import React from "react";
import { collateAllObjects } from "jec-jask";
import { connect } from "react-redux";
import {
	Pre,
	Box,
	Heading,
	Divider,
	Flex,
	Modal,
	Toolbar,
	Button,
	Fixed,
} from "rebass";

import Task from "./Task";

const ListContainerContainer = Flex.extend`
	flex-direction: column;
	align-items: stretch;
	justify-content: stretch;
	height: 100vh;
`;

@connect(R.identity)
class Tasks extends React.Component {
	render() {
		const tasks = R.sortBy(
			({ score }) => -score,
			collateAllObjects(this.props),
		);

		return (
			<React.Fragment>
				{this.props.distributeStatus !== "UP_TO_DATE" && (
					<Modal>
						<Heading>Loading Action</Heading>
						<Divider />
						<Pre>
						{R.pipe(
							R.pathOr("", ["actionChain", 0, "id"]),
							R.split("_"),
							R.nth(0),
						)(this.props)}
					</Pre>
					</Modal>
				)}
				<ListContainerContainer>
					<Box flex="0 0 64px" />

					<Box flex={1}>
						{tasks.map(task => <Task key={task.uuid} {...task} />)}
					</Box>
				</ListContainerContainer>

				<Fixed top={0} left={0} right={0}>
					<Toolbar bg="black">jec::jask::web</Toolbar>
				</Fixed>
			</React.Fragment>
		);
	}
}

export default Tasks;
