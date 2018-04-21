import { collateAllObjects, } from "jec-jask";
import { connect, } from "react-redux";
import { toDate, formatRelative, } from "date-fns/fp";
import { Toolbar, } from "rebass";
import {
	Button,
	Label,
	Segment,
	Statistic,
	Dimmer,
	Loader,
	Card,
	Container,
} from "semantic-ui-react";

const formatDate = R.pipe(toDate, formatRelative(new Date()));

const Task = ({ description, tags, due, wait, project, ...rest }) => (
	<Card>
		<Card.Content>
			<Card.Header disabled = { !!description }>
				{description || "No Description..."}
			</Card.Header>
			<Card.Meta textAlign = "right">{project}</Card.Meta>
		</Card.Content>
		<Card.Content>
			<Card.Description>
				{tags.map(tag => <Label>{tag}</Label>)}
			</Card.Description>
			<Card.Description>
				{due && "due " + formatDate(due)}
			</Card.Description>
			<Card.Description>
				{wait && "wait " + formatDate(wait)}
			</Card.Description>

			{R.toPairs(rest).map(([ key, val, ]) => (
				<Card.Description>
					{key}: {JSON.stringify(val)}
				</Card.Description>
			))}
		</Card.Content>

		<Card.Content>
			<div className = "ui three buttons">
				<Button basic color = "red">
					Delete
				</Button>
				<Button basic color = "yellow">
					Start
				</Button>
				<Button basic color = "green">
					Done
				</Button>
			</div>
		</Card.Content>
	</Card>
);

@connect(R.identity)
class Foo extends React.Component {
	render() {
		return this.props.__distributeStatus === "READY" ? (
			<Segment>
				<Toolbar>jask</Toolbar>

				<Card.Group centered stackable>
					{R.sortBy(
						({ score, }) => -score,
						collateAllObjects(this.props),
					).map(props => <Task { ...props } />)}
				</Card.Group>
			</Segment>
		) : (
			<Dimmer active>
				<Loader>Loading Actions</Loader>
			</Dimmer>
		);
	}
}

export default Foo;
