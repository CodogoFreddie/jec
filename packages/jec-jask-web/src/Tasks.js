import { collateAllObjects, } from "jec-jask";
import { connect, } from "react-redux";
import { toDate, formatRelative, } from "date-fns/fp";
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

const Task = props => (
	console.log(props),
	(
		<Card>
			<Card.Content>
				<Card.Header disabled = { !!props.description }>
					{props.description || "No Description..."}
				</Card.Header>
				<Card.Meta textAlign = "right">{props.project}</Card.Meta>
			</Card.Content>
			<Card.Content>
				<Card.Description>
					{props.tags.map(tag => <Label>{tag}</Label>)}
				</Card.Description>
				<Card.Description>
					{props.due && "due " + formatDate(props.due)}
				</Card.Description>
				<Card.Description>
					{props.wait && "wait " + formatDate(props.wait)}
				</Card.Description>
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
	)
);

@connect(R.identity)
class Foo extends React.Component {
	render() {
		return this.props.__distributeStatus === "READY" ? (
			<Segment>
				<Card.Group centered stackable>
					{collateAllObjects(this.props).map(props => (
						<Task { ...props } />
					))}
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
