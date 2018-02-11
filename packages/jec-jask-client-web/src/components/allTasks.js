import { Card, Flex, } from "./toolbox";

const Project = ({ children, }) =>
	!!children && <Flex> Project: {children} </Flex>;
const Due = ({ children, }) => !!children && <Flex> Due: {children} </Flex>;
const Wait = ({ children, }) => !!children && <Flex> Wait: {children} </Flex>;
const Tags = ({ children, }) =>
	!!children && <Flex> Tags: {children.join(", ")} </Flex>;

export default ({ tasks, }) => (
	<Flex>
		{tasks.map(
			({ uuid, description, due, tags, project, wait, priority, }) => (
				<Card key = { uuid } title = { description } uuid = { uuid }>
					<Project>{project}</Project>
					<Tags>{tags}</Tags>
					<Due>{due}</Due>
					<Wait>{wait}</Wait>
				</Card>
			),
		)}
	</Flex>
);
