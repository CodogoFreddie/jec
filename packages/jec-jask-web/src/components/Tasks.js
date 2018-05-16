import * as R from "ramda";
import styled from "styled-components";
import React from "react";
import { collateAllObjects } from "jec-jask";
import { connect } from "react-redux";
import { Flex, Toolbar, Button, Fixed } from "rebass";
import { AutoSizer, List } from "react-virtualized";

import Task from "./Task";

const ListContainerContainer = Flex.extend`
	flex-direction: column;
	align-items: stretch;
	justify-content: stretch;
	height: 100vh;
`;

const ListContainer = styled.div`
	flex: 1;
`;

@connect(R.identity)
class Foo extends React.Component {
	render() {
		const tasks = R.sortBy(
			({ score }) => -score,
			collateAllObjects(this.props),
		);

		const rowRenderer = ({ index, key, style }) => (
			<div key={key} style={style}>
				<Task {...tasks[index]} />
			</div>
		);

		const getRowHeight = ({ index }) => 300;

		return this.props.__distributeStatus === "READY" ? (
			<div>
				<ListContainerContainer>
					<Toolbar />

					<ListContainer>
						<AutoSizer>
							{({ height, width }) => (
								<List
									height={height}
									width={width}
									rowCount={tasks.length}
									rowHeight={getRowHeight}
									rowRenderer={rowRenderer}
								/>
							)}
						</AutoSizer>
					</ListContainer>
				</ListContainerContainer>

				<Fixed top={0} left={0} right={0}>
					<Toolbar>jec::jask::web</Toolbar>
				</Fixed>

				<Fixed m={4} bottom={0} right={0}>
					<Button fontSize={[5, 3]}>+ New</Button>
				</Fixed>
			</div>
		) : (
			<div>
				<div>Loading Actions</div>
			</div>
		);
	}
}

export default Foo;
