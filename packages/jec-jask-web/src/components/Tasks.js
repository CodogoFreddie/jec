import * as R from "ramda";
import React from "react";
import { collateAllObjects } from "jec-jask";
import { connect } from "react-redux";
import { Container, Toolbar, Button, Fixed } from "rebass";

import Task from "./Task";

@connect(R.identity)
class Foo extends React.Component {
	render() {
		return this.props.__distributeStatus === "READY" ? (
			<div>
				<Fixed top={0} left={0} right={0}>
					<Toolbar>jec::jask::web</Toolbar>
				</Fixed>
				<Toolbar />

				<Container>
					{R.sortBy(
						({ score }) => -score,
						collateAllObjects(this.props),
					).map(props => <Task key={props.uuid} {...props} />)}
				</Container>

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
