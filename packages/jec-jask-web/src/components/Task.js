import * as R from "ramda";
import React from "react";
import { formatRelative, toDate } from "date-fns/fp";
import {
	Small,
	Divider,
	Card,
	Heading,
	Group,
	Button,
	Badge,
	Text,
	Lead,
} from "rebass";

const formatDate = R.pipe(toDate, formatRelative(new Date()));
const formatRecur = ({ n, period }) =>
	({
		d: n => `${n} day`,
		w: n => `${n} week`,
		m: n => `${n} month`,
		y: n => `${n} year`,
	}[period](n) + (n > 1 ? "s" : ""));

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
	...rest
}) => (
	<Card m={[3, 2]} p={3}>
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
		<Text>{recur && "recurs every " + formatRecur(recur)}</Text>

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

export default Task;
