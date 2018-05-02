import * as R from "ramda";
import React from "react";
import { collateAllObjects } from "jec-jask";
import { connect } from "react-redux";
import { formatRelative, toDate } from "date-fns/fp";
import {
	Small,
	Divider,
	Card,
	Heading,
	Container,
	Toolbar,
	Group,
	Button,
	Badge,
	Text,
	Lead,
	Fixed,
} from "rebass";

const formatDate = R.pipe(toDate, formatRelative(new Date()));

const Task = ({ description, tags, due, wait, project, score, ...rest }) => (
	<Card m={2} p={3}>
		<Heading disabled={!!description}>
			{description || "No Description..."}
		</Heading>
		<Lead>
			{score.toPrecision(3)}
			{" | "}
			{tags.map(tag => <Badge>{tag}</Badge>)}
			{" | "}
			{project}
		</Lead>
		<Divider />

		<Text>{due && "due " + formatDate(due)}</Text>
		<Text>{wait && "wait " + formatDate(wait)}</Text>

		{R.toPairs(rest).map(([key, val]) => (
			<Text>
				<Small>
					{key}: {JSON.stringify(val)}
				</Small>
			</Text>
		))}

		<Divider />
		<Group>
			<Button bg="red">Delete</Button>
			<Button bg="yellow">Start</Button>
			<Button bg="green">Done</Button>
		</Group>
	</Card>
);

@connect(R.identity)
class Foo extends React.Component {
	render() {
		return this.props.__distributeStatus === "READY" ? (
			<div>
				<Toolbar>jec::jask::web</Toolbar>

				<Container>
					{R.sortBy(
						({ score }) => -score,
						collateAllObjects(this.props),
					).map(props => <Task key={props.uuid} {...props} />)}
				</Container>

				<Fixed m={4} bottom={0} right={0}>
					<Button fontSize={3}>+ New</Button>
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
