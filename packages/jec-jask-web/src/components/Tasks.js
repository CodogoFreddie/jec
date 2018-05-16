import * as R from "ramda";
import React from "react";
import { collateAllObjects } from "jec-jask";
import { connect } from "react-redux";
import { Box, Flex, Toolbar, Button, Fixed } from "rebass";

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

		return this.props.__distributeStatus === "READY" ? (
			<div>
				<ListContainerContainer>
					<Box flex="0 0 64px" />

					<Box flex={1}>
						{tasks.map(task => <Task key={task.uuid} {...task} />)}
					</Box>
				</ListContainerContainer>

				<Fixed top={0} left={0} right={0}>
					<Toolbar bg="black">jec::jask::web</Toolbar>
				</Fixed>

				<Fixed m={4} bottom={0} right={0}>
					<Button bg="blue" fontSize={[5, 3]}>
						+ New
					</Button>
				</Fixed>
			</div>
		) : (
			<div>
				<div>Loading Actions</div>
			</div>
		);
	}
}

export default Tasks;
